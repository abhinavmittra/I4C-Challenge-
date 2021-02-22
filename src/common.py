# from flask import Flask, request, url_for , redirect , send_from_directory
from ssl import create_default_context
import datetime
from datetime import timedelta
import json
import jsonpickle
import datetime
from datetime import timedelta
import os
from os import listdir
from os.path import isfile, join
from base64 import b64encode
import base64

class responsePackage:
    def __init__(self,status,message):
        self.status = status
        self.message = message

class image:
    def __init__(self,userId,date,imageName,image):
        self.userId = userId
        self.date = date
        self.imageName = imageName
        self.image = image

class category:
    def __init__(self,name,subcategories):
        self.name=name
        self.subCategories=subcategories

class categoryPackage:
    def __init__(self,categoryList,status,message):
        self.categoryList = categoryList
        self.status=status
        self.message=message
class userAlert:
    def __init__(self,date,message,action,reqId,donorId,itemId,ngoId):
        self.date = date
        self.message=message
        self.action=action
        self.requirementId=reqId
        self.donorId=donorId
        self.itemId=itemId
        self.ngoId=ngoId
        
class userAlertPackage:
    def __init__(self,alerts,status,message):
        self.alerts=alerts
        self.status=status
        self.message=message
def getImage(request,es):
        try:
            data = json.loads(request.data)
            imageId = data["imageId"]
            print("imageId = ",imageId)
            res = es.search(index = "images", body={"query":{"term":{"_id":imageId}}})
            if len(res["hits"]["hits"]) > 0:
                print("yes")
                image = res["hits"]["hits"][0]["_source"]
                imageInfo = {
                        "userId": image["userId"],
                        "date": image["date"],
                        "imageName": image["imageName"],
                        "image": image["image"]
                }
            else:
                imageInfo = {}
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't get image"),unpicklable=False)
        return imageInfo

def saveImage(file,userId,es,app):
    try:
        filename = file.filename
        #saving image as it needs to be opened while encoding
        file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        imagepath = './Upload_folder/' + filename
        with open(imagepath, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
            #deleting the saved image
        if os.path.exists(imagepath):
            os.remove(imagepath)

        date = datetime.datetime.now(datetime.timezone.utc)   

        query = {
            "image": encoded_string.decode('utf-8'),
            "userId" : userId,
            "date": date,
            "imageName": file.filename
        }

        res = es.index(index = "images", body = query)
        imageId = res["_id"]

    except Exception as e:
        print(e,"error in image converion")
        return "-1"
    return imageId

def sendMessage(request,es, messageFrom,app):
    if request.method=="POST":
        try:
            message = request.form.get('message')
            reqId = request.form.get('requirementId')
            ngoId = request.form.get('ngoId')
            itemId = request.form.get('itemId')
            donorId  = request.form.get('donorId')

            imageId = "-1"
            try:
                f= f = request.files['image']
                if messageFrom == "NGO":
                    userId = ngoId
                else:
                    userId = donorId    
                imageId = saveImage(f,userId,es,app)
            except Exception:
                print("No image inserted")    

            res = es.search(index="accounts",body={"query":{"term":{"_id":ngoId}}})
            ngoName = res["hits"]["hits"][0]["_source"]["ngoName"]
            query = {
                "docType" : "update",
                "updateType" : "message",
                "details": message,
                "requirementId": reqId,
                "donorId": donorId,
                "ngoId" : ngoId,
                "itemId" : itemId,
                "messageFrom": messageFrom,
                "ngoName":ngoName,
                "date": datetime.datetime.now(datetime.timezone.utc),
                "imageLink": imageId
            }
            res = es.index(index = "donations", body =(query))
            # print(res)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't send message"),unpicklable=False)
        return json.dumps({"status":"Success","imageId":imageId})    

def getCategoryList(es,app):
    try:
        res = es.search(index = "categories", body = {
            "size": 0,
            "aggs": {
                "categories": {
                    "terms":{
                        "field": "category",
                         "size": 1000
                    },
                    "aggs":{
                        "subcategories":{
                            "terms": {
                                "field": "subCategory",
                                "size": 1000
                            }
                         }
                     }
                 }
            }
        })
        
        categoryList = []
        for catobj in res["aggregations"]['categories']["buckets"]: 
            subcategories = []
            for subcatobj in catobj["subcategories"]["buckets"]:
                subcategories.append(subcatobj["key"])
            #resultvalues[catobj["key"]] = category
            categoryList.append(category(catobj["key"],subcategories))
            
            

        #result["categoryInfo"] = resultvalues
    except Exception as e:
        print(e)
        return jsonpickle.encode(responsePackage("Error","Couldn't fetch categories"),unpicklable=False)           

    return jsonpickle.encode(categoryPackage(categoryList,"success","Returned Category Info successfully"),unpicklable=False) 

def createAlert(userId,dateCreated,activationDate,message,donorId,ngoId,itemId,requirementId,action,es):
    try:
        query = {
            "userId": userId,
            "dateCreated": dateCreated,
            "activationDate": activationDate,
            "activeFlag": "true",
            "alertMessage": message,
            "donorId": donorId,
            "ngoId": ngoId,
            "itemId": itemId,
            "requirementId": requirementId,
            "acton": action,
            "newFlag": "true"
        }

        res = es.index(index = "alerts", body = query)
        print("alert: " + res["_id"])
    except Exception as e:
        print(e)

def getAlerts(userId,es):
    try:
        query = {
            "sort":{
                    "activationDate" : "asc"
                    },
            "query":{
                
                "bool":{
                    "must":[
                    { "term": { "userId": userId}},
                    { "term": { "newFlag": "true"}},
                    { "term": { "activeFlag": "true"}},
                    { "range" : {"activationDate" : { "lte" : datetime.datetime.now(datetime.timezone.utc)} } }
                    ]

                    
                }
            }
        }

        alerts = []
        

        res = es.search(index="alerts", body = query)
        for alert in res["hits"]["hits"]:
            alerts.append(userAlert(alert["_source"]["activationDate"],alert["_source"]["alertMessage"],alert["_source"]["acton"],alert["_source"]["requirementId"],
            alert["_source"]["donorId"],alert["_source"]["itemId"],alert["_source"]["ngoId"]))



    except Exception as e:
        print(e)    
        return jsonpickle.encode(responsePackage("Error","Couldn't fetch alerts"),unpicklable=False)    

    return jsonpickle.encode(userAlertPackage(alerts,"Success","Returned Alerts"),unpicklable=False)

def rateUser(userId,rating,es):
    try:

        res = es.search(index="accounts", body = {
            "query" : {
                "term":{
                    "_id":{
                        "value": userId
                    }
                }
            }
            })

        numberOfRatings = res["hits"]["hits"][0]["_source"]["numberOfRatings"]
        oldRating = float(res["hits"]["hits"][0]["_source"]["averageRating"])

        newRating =   ( ( numberOfRatings * oldRating ) + rating ) / ( numberOfRatings + 1 )

        source = "ctx._source.numberOfRatings += 1"

        query = {
            "script" : {
                "source" : source
                }
            }

        es.update(index="accounts" , id = userId , body = (query))

        source = "ctx._source.averageRating = '%s'"%(newRating)

        query = {
            "script" : {
                "source" : source
                }
            }
        es.update(index="accounts" , id = userId , body = (query))    

    except Exception as e:
        print(e)
        return jsonpickle.encode(responsePackage("Error","Couldn't rate user"),unpicklable=False)
    return jsonpickle.encode(responsePackage("Success","Rated user, new rating is " + str(newRating)),unpicklable=False)