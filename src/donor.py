from ssl import create_default_context
import json
import jsonpickle
import datetime
from datetime import timedelta
from werkzeug.utils import secure_filename
import os
from os import listdir
from os.path import isfile, join
from common import saveImage
import math

class responsePackage:
    def __init__(self,status,message):
        self.status = status
        self.message = message
class itemRequirement:
     def __init__(self,ID,name,category,subcategory,details,quantity,ngoId,ngo,date,pincode):
        self.requirementId =ID
        self.name = name
        self.category = category
        self.subcategory = subcategory
        self.details = details
        self.quantity = quantity
        self.ngoId = ngoId
        self.ngo = ngo
        self.date=date
        self.pincode=pincode

class itemRequirementPackage:
    def __init__(self,itemRequirements,status,message):
        self.itemRequirements = itemRequirements
        self.status = status
        self.message = message

class donorUpdate:
    def __init__(self,updateType,itemId,reqId,ngoId,donorId,ngoName,reqQuantity,reqDetails,messageFrom,message):
        self.updateType = updateType
        self.itemId = itemId
        self.reqId = reqId
        self.ngoId = ngoId
        self.donorId = donorId
        self.ngoName = ngoName
        self.reqQuantity = reqQuantity
        self.reqDetails = reqDetails
        self.messageFrom = messageFrom
        self.message = message

#create donor account
def userAccountCreation(request,es):
    if request.method == "POST":
        try:
            # print (request.data)
            data = json.loads(request.data)
            email = data ["Email"]
            # print (data)
            query = '{"query":{"term":{"email": "%s"}}}'%(email)
            emailExists = es.search(index="accounts", body=query)
            value = emailExists["hits"]["total"]["value"]
            if value >= 1:
                result = jsonpickle.encode("Failure","Couldn't Create an account")
                return result
            else: 
                data["numberOfRatings"] = "0"
                data["averageRating"] = "0"
                data["userType"] = "donor"
                
                query = {
                        "name":data["Name"],
                        "passwordHash":data["PasswordHash"],
                        "address":data["Address"],
                        "phone":data["Phone"],
                        "email":data["Email"],
                        "pincode":data["Pincode"],
                        "userType":data["userType"],
                        "numberOfRatings":data["numberOfRatings"],
                        "averageRating":data["averageRating"]
                        }
                
                res = es.index(index = "accounts", body = query)
                result = responsePackage("Success","User created successfully")
                result = jsonpickle.encode(result,unpicklable=False)
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't create user"),unpicklable=False)
        return result

#function to donate an item 
def donateItem(request,es,app):
    if request.method == "POST":
        try:
            category = request.form["category"]
            subcategory = request.form["subcategory"]
            itemname = request.form["name"]
            details = request.form["details"]
            quantity = int(request.form["quantity"])
            quality = request.form["quality"]
            donorID = request.form["donorId"]
            pincode = request.form["pincode"]
            date = datetime.datetime.now(datetime.timezone.utc)

            try:
                f = request.files['image']
                imageId = saveImage(f,donorID,es,app)
                if imageId == "-1":
                	raise ValueError("failed to save image")
            except Exception as e:
                print(e)
                return jsonpickle.encode(responsePackage("Failure","Error in image upload"),unpicklable=False)
    
            limitQuery = {
                "query": {
                    "term": {
                        "subCategory": {
                            "value": subcategory 
                        }
                    }
                }
            }    

            limitRes = es.search(index = "categories", body=limitQuery )

            if quantity >= limitRes["hits"]["hits"][0]["_source"]["minimumQuantityForLimit"]:
                percentage = limitRes["hits"]["hits"][0]["_source"]["maximumRequestQuantityPercentage"]
                limit = percentage * quantity / 100
                limit = math.ceil(limit)
            else:
                limit = quantity

            query = {
                        "docType":"item",
                        "category":category,
                        "subCategory":subcategory,
                        "itemName":itemname,
                        "details":details,
                        "quantity":quantity,
                        "quality":quality,
                        "donorId":donorID,
                        "pincode":pincode,
                        "publicFlag": "true",
                        "date":date,
                        "imageLink": imageId,
                        "requestLimit": limit
                    }
                    
            res = es.index(index="donations", body=(query))
            ID = res["_id"]

        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Could not create an item"),unpicklable=False)
        return json.dumps({"status":"Success","itemId":ID,"imageId":imageId})

#function to get requirements

def getRequirements(request,es):
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            donorId = data["donorId"]
            #get category, subcategory and pincode
            result = es.search(index = "donations", body = {"size": 10,"query": {"bool":{"must": [{ "term" : { "docType" : "item" } },{ "term" : { "donorId" : donorId } }]}}})
            # print (result)
            items = result["hits"]["hits"]
            if len(items) > 0:
                pincode = items[0]["_source"]["pincode"]
                subcategory = []
                category = []
                for item in items:
                    subcategory.append(item["_source"]["subCategory"])
                    category.append(item["_source"]["category"])
            else:
                pincode = ""
                category = []
                subcategory = []
            # res = es.search(index="donations", body={"query":{"bool":{"must": [{"term" : {"docType" : "requirement" }},{"term":{"publicFlag":"true"}},{"range" : {"quantity" : { "gte" : 0}}}]}}})
            res = es.search(index="donations",body = {"size": 10000,"query":{"bool":{"must": [{ "term" : { "docType" : "requirement" } },{ "term" : { "publicFlag" : "true" } },{"range" : {"quantity" : { "gt" : 0}}}],
                    "should": [
                        { "term" : { "pincode" : pincode} },
                        { "terms" : {"category.keyword": category } },
                        { "terms" : {"subCategory.keyword": subcategory } }
                            ]
                    }
                }
            })
            # print(res["hits"]['hits'][0]['_source']['details'])
            dataList = []
            
            for item in res["hits"]['hits']:
                if 'ngoName' in item['_source']:
                    ngo = item['_source']['ngoName']
                else:
                    ngo = ""
                if 'details' in item['_source']:
                    details = item['_source']['details']
                else:
                    details = ""
                dataList.append(itemRequirement(item['_id'],item['_source']['itemName'],item['_source']['category'],item['_source']['subCategory'],details,item['_source']['quantity'],item['_source']['ngoId'],ngo,item['_source']['date'],item['_source']['pincode']))
            # for obj in dataList:
                # print(obj.name)
            result = itemRequirementPackage(dataList,"success","object contains list of requirements")
        except Exception as e: 
            print(e)
            result = itemRequirementPackage("","failure","")
        result = jsonpickle.encode(result,unpicklable=False)
        return result

#function to respond to a requirement
def respondToRequirement(request,es,app):
    if request.method == "POST":
        try:
            donorID = request.form['donorId']
            category = request.form['category']
            subcategory = request.form['subcategory']
            itemname = request.form['name']
            requirementID = request.form['requirementId']
            NGOID = request.form['ngoId']
            quantity = request.form['quantity']
            quality = request.form['quality']
            pincode = request.form['pincode']
            details = request.form['details']
            public = request.form['public']
            # date = datetime.datetime.now(datetime.timezone.utc)
            
            try:
                f = request.files['image']
                imageId = saveImage(f,donorID,es,app)
                if imageId == "-1":
                	raise ValueError("failed to save image")
            except Exception as e:
                print(e)
                return jsonpickle.encode(responsePackage("Failure","Error in image upload"),unpicklable=False)

            query1 = {
                "docType":"item",
                "category":category,
                "subCategory":subcategory,
                "itemName":itemname,
                "quality":quality,
                "quantity":quantity,
                "donorId":donorID,
                "pincode":pincode,
                "details":details,
                "publicFlag":public,
                "donorId":donorID,
                "date":datetime.datetime.now(datetime.timezone.utc),
                "imageLink": imageId,
                "requestLimit": quantity
            }

            result = es.index(index="donations", body=(query1))
            ID = result["_id"]
            
            #get ngoName via ngoId
            res = es.search(index="accounts",body={"query":{"term":{"_id":NGOID}}})
            ngoName = res["hits"]["hits"][0]["_source"]["ngoName"]
            
            query2 = {
                "docType":"update",
                "updateType":"donate",
                "ngoId":NGOID,
                "requirementId":requirementID,
                "donorId":donorID,
                "itemId":ID,
                "date":datetime.datetime.now(datetime.timezone.utc)+timedelta(seconds=10),
                "ngoName":ngoName,
                "quantity":quantity,
                "quality":quality,
                "details":details,
                "pincode":pincode,
                "imageLink": imageId
            }
            res = es.index(index="donations", body=(query2))
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Error in respond to requirement"),unpicklable=False)
        return json.dumps({"status":"Success","itemId":ID,"imageLink":imageId})


#function to respond to a donation request 
def respondToDonationRequest(request,es):
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            ngoId = data["ngoId"]
            ngoName = data["ngoName"]
            itemId = data["itemId"]
            donorId = data["donorId"]
            reqId = data["requirementId"]
            quantity = data["quantity"]
            actionTaken = data["actionTaken"] #Added actionTaken by Donor (accept/decline)
            # date = datetime.datetime.now(datetime.timezone.utc)
            
            if actionTaken == "accept":
                query1 = {
                    "docType":"update",
                    "updateType":"accept",
                    "ngoId":ngoId,
                    "ngoName" : ngoName,
                    "itemId" : itemId,
                    "donorId" : donorId,
                    "requirementId" : reqId,
                    "date": datetime.datetime.now(datetime.timezone.utc)
                }
            
                
                #adding document with updateType "accept"
                result1 = es.index(index = "donations", body = (query1))
        
                # updating the quantites
                # print(reqId)
                # requirement = es.search(index = "donations", body = {"query": {"term": {"_id": reqId}}})
                # reqQuantity = requirement["hits"]["hits"][0]["_source"]["quantity"]
                # print(reqQuantity)
                #item = es.search(index = "donations", body = {"query": {"term": {"_id": itemId}}})
                #itemQuantity = item["hits"]["hits"][0]["_source"]["quantity"]
                # print(itemQuantity)
                # finalQuantity = reqQuantity - itemQuantity
                #print(finalQuantity)
                # print(itemQuantity)
                # print(reqId)
                source = "ctx._source.quantity -= %d"%(int(quantity))
                # print("{\"script\" : {\"source\": %s}}"%(source))
                query = {
                    "script" : {
                        "source" : source
                    }
                }
                result3 = es.update(index="donations" , id = reqId , body = (query))
                result4 = es.update(index="donations" , id = itemId , body = (query))
                # return result3
            elif actionTaken == "decline":
                query1 = {
                    "docType":"update",
                    "updateType":"decline",
                    "ngoId":ngoId,
                    "ngoName" : ngoName,
                    "itemId" : itemId,
                    "donorId" : donorId,
                    "requirementId" : reqId,
                    "date": datetime.datetime.now(datetime.timezone.utc)
                }           
                #adding document with updateType "decline"
                result1 = es.index(index = "donations", body = (query1))
                # return result1
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't respond to donation request"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Responded to donation request"),unpicklable=False)  

#function to delete an item
def deleteItem(request,es):
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            itemId = data["itemId"]
            donorId = data["donorId"]
            #setting Public Flag to false for the item
            res1 = es.update(index = "donations", id = itemId, body = {"script" : {"source": "ctx._source.publicFlag = false"}})
            #get all requirements
            res2 = es.search(index = "donations", body ={"query": {"bool":{"must": [{ "term" : { "updateType" : "donateRequest" } },{ "term" : {"itemId" : itemId} }]}}})
            requirementList = []
            for item in res2["hits"]["hits"]:
                if "requirementId" in item["_source"]:
                    requirementList.append(item["_source"])
            # print(requirementList)
            #setting updateType as itemDeleted for each requirement Id
            if len(requirementList) > 0:
                for requirement in requirementList:
                    res = es.search(index="accounts",body={"query":{"term":{"_id":requirement["ngoId"]}}})
                    ngoName = res["hits"]["hits"][0]["_source"]["ngoName"]
                    query = {
                        "docType":"update",
                        "updateType":"itemDeleted",
                        "ngoId":requirement["ngoId"],
                        "requirementId":requirement["requirementId"],
                        "ngoName":ngoName,
                        "itemId":itemId,
                        "donorId": donorId,
                        "date": datetime.datetime.now(datetime.timezone.utc)
                    }
                    res1 = es.index(index="donations",body=(query))
            else:
                #ngoId and requirement id will be blank
                query = {
                        "docType":"update",
                        "updateType":"itemDeleted",
                        "ngoId":"",
                        "requirementId":"",
                        "ngoName":"",
                        "itemId":itemId,
                        "donorId": donorId,
                        "date": datetime.datetime.now(datetime.timezone.utc)
                    }
                res = es.index(index="donations",body=(query))
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't delete item"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Deleted Item Successfully"),unpicklable=False)

#function to get updates for donor
def getUpdatesForDonor(request,es):
    if request.method=="POST":
        try:
            # es_updated = Elasticsearch(
            #    ['https://5ea0807d2db24793b2ae5f6ee4f413bd.ap-south-1.aws.elastic-cloud.com:9243'],
            #    http_auth=("elastic","JEjJFXwITPboNUxEIcnxwsYs"),
            #     scheme = "https",
            #     )
            data = json.loads(request.data)
            donorID = data["donorId"]
            res = es.search(index = "donations", body={"size": 10000,"sort":{"date" : "asc"},"query":{"bool": {"must": [{ "term": { "donorId" : donorID}}],"should": [{ "term" : { "docType": "item" } },{ "term" : { "docType": "update" } }],"minimum_should_match": 1}}})
            # print(res["hits"]['hits'])
            result = []
            count = 0
            for obj in res["hits"]['hits']:
                
             
                # print(obj["_source"]["docType"])
                if obj["_source"]["docType"] == "item":
                    count=count+1
                    item = {
                            "Item"+str(count): {
                            "itemId":    obj["_id"],
                            "itemName" : obj["_source"]["itemName"],
                            "itemCategory" : obj["_source"]["category"],
                            "itemSubcategory" : obj["_source"]["subCategory"],
                            "itemQuantity" : obj["_source"]["quantity"],
                            "itemQuality" :obj["_source"]["quality"],
                            "itemDetails" : obj["_source"]["details"],
                            "itemDate" : obj["_source"]["date"],
                            "itemImageLink":obj["_source"]["imageLink"],
                            "itemUpdates" : []
                        }
                    }
                    if "requestLimit" in obj["_source"]:
                        item["requestLimit"] = obj["_source"]["requestLimit"]
                    result.append(item)
                if obj["_source"]["docType"] == "update":
               
                    updateType = obj["_source"]["updateType"]
                    if "itemId" in obj["_source"]:
                        itemId = obj["_source"]["itemId"]
                    else:
                        itemId = ""
                    if "requirementId" in obj["_source"]:
                        reqId = obj["_source"]["requirementId"]
                    else:
                        reqId = ""
                    if "ngoId" in obj["_source"]:
                        ngoId = obj["_source"]["ngoId"]
                    else:
                        ngoId = ""
                    if "donorId" in obj["_source"]:
                        donorId = obj["_source"]["donorId"]
                    else: 
                        donorId = ""
                    if "ngoName" in obj["_source"]:
                        ngoName = obj["_source"]["ngoName"]
                    else:
                        ngoName = ""
                    
                    if "quantity" in obj["_source"]:
                        reqQuantity = obj["_source"]["quantity"]
                    else:
                        reqQuantity = ""                    
                    if "messageFrom" in obj["_source"]:
                        messageFrom = obj["_source"]["messageFrom"]
                    else:
                        messageFrom = ""
                    pincode = ""
                    if "pincode" in obj["_source"]:
                        pincode = obj["_source"]["pincode"]
                    date = ""
                    if "date" in obj["_source"]:
                        date=obj["_source"]["date"]
                    
                    #because message field is details in backend so check if type message then set message otherwise assign details to details var
                    message = ""
                    details = ""
                    if updateType=="message":
                        if "details" in obj["_source"]:
                            message = obj["_source"]["details"]
                        else:
                            message = ""
                    else:
                        if "details" in obj["_source"]:
                            reqDetails = obj["_source"]["details"]
                        else:
                            reqDetails = ""
                    
                    
                    #update = donorUpdate(updateType,itemId,reqId,ngoId,donorId,ngoName,reqQuantity,reqDetails,messageFrom,message)
                    update = {
                        "updateType":updateType,
                        "itemId":itemId,
                        "reqId":reqId,
                        "ngoId":ngoId,
                        "donorId":donorId,
                        "ngoName":ngoName,
                        "reqQuantity":reqQuantity,
                        "reqDetails":reqDetails,
                        "messageFrom":messageFrom,
                        "message":message,
                        "pincode":pincode,
                        "updateDate":date
                    }
                    # update = donorUpdatePackage(updateDetails,"success")
                    
                    count=0
                    for item in result:
                        count=count+1
                        if item["Item"+str(count)]["itemId"] == itemId:
                            
                            item["Item"+str(count)]["itemUpdates"].append(update)
                    
                
            #Add empty strings for items with no updates
            count=0
            for item in result:
                count=count+1
                if len(item["Item"+str(count)]["itemUpdates"])==0:
                    update = {
                         "updateType" : "noupdate"
                         
                     }
                    item["Item"+str(count)]["itemUpdates"].append(update)
                    
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't fetch updates for donor"),unpicklable=False)
         
        return json.dumps({"updatesForDonor":result})
