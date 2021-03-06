# from flask import Flask, request, url_for , redirect , send_from_directory
from ssl import create_default_context
import json
import jsonpickle
import datetime
from datetime import timedelta
from werkzeug.utils import secure_filename
import os
from os import listdir
from os.path import isfile, join
from common import saveImage, createAlert

class responsePackage:
    def __init__(self,status,message):
        self.status = status
        self.message = message
class ngo:
    def __init__(self,ngoId,name,email,phone,pan,address,pincode,imageLink,additionalComments):
        self.ngoId = ngoId
        self.name = name
        self.email = email
        self.phone = phone
        self.pan = pan
        self.address = address
        self.pincode = pincode
        self.imageLink = imageLink
        self.additionalComments = additionalComments

class ngoPackage:
    def __init__(self,ngoList,status,message):
        self.ngoList = ngoList
        self.status = status
        self.message = message

class donationItem:
    def __init__(self,itemId,name,category,subcategory,details,quantity,quality,imglink,donorId,date,pincode,requestLimit):
        self.itemId = itemId
        self.name = name
        self.category = category
        self.subcategory = subcategory
        self.details = details
        self.quantity = quantity
        self.quality = quality
        self.imgLink = imglink
        self.donorId = donorId
        self.date = date
        self.pincode=pincode
        self.requestLimit = requestLimit
class donationItemPackage:
    def __init__(self,donationItems,status,message):
        self.donationItems = donationItems
        self.status = status
        self.message = message

class ngoUpdate:
    def __init__(self,updateType,itemId,reqId,ngoId,donorId,itemQuantity,itemQuality,itemDetails,messageFrom,message):
        self.updateType = updateType
        self.itemId = itemId
        self.reqId = reqId
        self.ngoId = ngoId
        self.donorId = donorId
        self.itemQuantity = itemQuantity
        self.itemQuality = itemQuality  
        self.itemDetails = itemDetails
        self.messageFrom = messageFrom
        self.message = message

#create ngo account
def createNgoAccount(request,es,app):
    if request.method == "POST":
        try:
            # print (request.data)
            
            email = request.form["Email"]
            # print (data)
            query = '{"query":{"term":{"email": "%s"}}}'%(email)
            emailExists = es.search(index="accounts", body=query)
            value = emailExists["hits"]["total"]["value"]
            if value >= 1:
                result = responsePackage("Error","Couldn't create ngo account")
                result = jsonpickle.encode(result)
                return result
            else :
                
                image = request.files['image']
                
                
                query = {
                    "ngoName":request.form["NGOName"],
                    "address":request.form["Address"],
                    "email":request.form["Email"],
                    "phone":request.form["Phone"],
                    "website":request.form["Website"],
                    "pincode":request.form["Pincode"],
                    "passwordHash":request.form["PasswordHash"],
                    "userType":"NGO",
                    "pan":request.form["PAN"],
                    "description":request.form["description"],
                    "additionalComments":request.form["comments"],
                    "imageLink":"-1", #keeping default value as -1
                    "numberOfRatings" : 0,
                    "averageRating": "0"
                }
           
                
                res = es.index(index = "accounts", body = query)
                ngoId = res["_id"]
                #saving Image
                imageId = saveImage(image,ngoId,es,app)
                if imageId != "-1":
                    source = "ctx._source.imageLink = '%s'"%(imageId)
                    query = {
                        "script" : {
                            "source" : source
                        }
                    }
                    print(query)
                    res2 = es.update(index = "accounts", id = ngoId, body = (query))
                result = responsePackage("Success","Ngo Account created successfully")
                result = jsonpickle.encode(result,unpicklable=False)
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Couldn't create ngo account"),unpicklable=False)
        return result

#get ngo information
def getNgoInfo(request,es):
    if request.method=="GET":
        try:
            data = json.loads(request.data)
            ngoId = data["ngoId"]
            print("ngoId = ",ngoId)
            res = es.search(index = "accounts", body={"query":{"term":{"_id":ngoId}}})
            if len(res["hits"]["hits"]) > 0:
                print("yes")
                ngo = res["hits"]["hits"][0]["_source"]
                ngoInfo = {
                        "address": ngo["address"],
                        "description": ngo["description"],
                        "email": ngo["email"],
                        "ngoName": ngo["ngoName"],
                        "pan": ngo["pan"],
                        "phone": ngo["phone"],
                        "pincode": ngo["pincode"],
                        "verifiedNgoFlag": ngo["verifiedNgoFlag"],
                        "website": ngo["website"],
                }
            else:
                ngoInfo = {}
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't get NGO Information"),unpicklable=False)
        return ngoInfo

def getNgoListUnverified(request,es):
    if request.method == "GET":
        try:
            res = es.search(index="accounts", body={"query":{"bool":{"must":{"term" : {"userType" : "NGO"  }},"must_not":{"term" : { "verifiedNgoFlag" : "true" }}}}})
            
            ngoList = []
            for item in res["hits"]['hits']:
                imgLink="-1"
                comments = "No Comments"
                if "imageLink" in item['_source']:
                    imgLink=item['_source']['imageLink']
                if "additionalComments" in item["_source"]:
                    comments = item["_source"]["additionalComments"]
                ngoList.append(ngo(item['_id'],item['_source']['ngoName'],item['_source']['email'],item['_source']['phone'],item['_source']['pan'],item['_source']['address'],item['_source']['pincode'],imgLink,comments))
            
            
            res = ngoPackage(ngoList,"Success","Fetched all items")
        except Exception as e: 
            print(e)
            return jsonpickle.encode(ngoPackage([],"Failure","error occured"),unpicklable=False)
        return jsonpickle.encode(res,unpicklable=False)


def requestItem(request,es):
    if request.method == "POST":
        try:
            #data = json.loads(request.data)
            #del data["itemId"]
            #print(data)
           
            category = request.form["category"]
            subCategory = request.form["subcategory"]
            name = request.form["name"]
            details = request.form["details"]
            quantity = request.form["quantity"]
            pincode = request.form["pincode"]
            ngoId = request.form["ngoId"]
            itemId = request.form["itemId"]
            public = request.form["public"]
            ngoName = request.form["ngoName"]
            print(itemId)
            # date = datetime.datetime.now(datetime.timezone.utc) #changed to using utc format or else time and date will be different for users living in different areas
            query = {
                        "docType":"requirement",
                        "category":category,
                        "subCategory":subCategory,
                        "itemName":name,
                        "details":details,
                        "quantity":int(request.form["quantity"]),
                        "ngoId":ngoId,
                        "ngoName":ngoName,
                        "pincode":pincode,
                        "publicFlag":public,
                        "date":datetime.datetime.now(datetime.timezone.utc)
                    }
            res = es.index(index="donations", body=(query))
            requirementID = res["_id"]  
            
            #Also get donorId from Item
            res = es.get(index="donations", id=itemId)
            donorId = res["_source"]["donorId"]
            
            query = {
            "docType":"update",
            "updateType":"donateRequest",
            "ngoId":ngoId,
            "itemId":itemId,
            "donorId":donorId,
            "requirementId":requirementID,
            "quantity":quantity,
            "date":datetime.datetime.now(datetime.timezone.utc)+timedelta(seconds=10),
            "details":details,
            "ngoName":ngoName,
            "pincode":pincode
            }
            result = es.index(index="donations", body=query)
            response = responsePackage("Success","Requested Item")
        except Exception as e: 
            print(e)
            print("Error in request item function")
            return jsonpickle.encode(responsePackage("Error","Couldn't perform action"),unpicklable=False)
            
        response = json.dumps({"status":"Success","requirementId":requirementID})
        return response

#function to get available items
def getItems(request,es):
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            ngoId = data["ngoId"]
            #get category, subcategory and pincode
            result = es.search(index = "donations", body = {"size": 10,"query": {"bool":{"must": [{ "term" : { "docType" : "requirement" } },{ "term" : { "ngoId" : ngoId } }]}}})
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
            # res = es.search(index="donations", body={"query":{"bool":{"must": [{"term" : {"docType" : "item" }},{"term":{"publicFlag":"true"}}],"must_not": [{"term" : {"donatedFlag": "true" }}]}}})
            res = es.search(index = "donations" , body = {
                "size": 10000,
                "query":{
                "bool":{
                    "must": [
                    { "term" : { "docType" : "item" } },
                    { "term" : { "publicFlag" : "true" } },
                    { "range" : {"quantity" : { "gt" : 0} } }
                    ], 
                    "should": [
                    { "term" : { "pincode" : pincode} },
                    { "terms" : {"category.keyword": category } },
                    { "terms" : {"subCategory.keyword": subcategory } }
                    ]
                }
                }
            })
            # print(res["hits"]['hits'])
            dataList = []
            for item in res["hits"]['hits']:
                ID = item['_id']
                imglink = item["_source"]["imageLink"]
                # Old code to get imageLink by checking if file exists
                # try:
                #     path = './Upload_folder'
                #     fileist = [f for f in listdir(path) if isfile(join(path, f))]
                #     for f in fileist:
                #         if f.split('.')[0] == ID:
                #             imglink = "/uploads/" + f
                #             break
                #     # print(imglink)
                # except Exception as e:
                #     print("error in finding file")
                #     print(e)
                
                if "requestLimit" in item["_source"]:
                        requestLimit = item["_source"]["requestLimit"]
                else:
                    requestLimit=item["_source"]["quantity"]
                dataList.append(donationItem(item['_id'],item['_source']['itemName'],item['_source']['category'],item['_source']['subCategory'],item['_source']['details'],item['_source']['quantity'],item['_source']['quality'],imglink,item['_source']['donorId'],item['_source']['date'],item['_source']['pincode'],requestLimit))
            for obj in dataList:
                print(obj.name)
            result = donationItemPackage(dataList,"success","object contains list of items up for donation")
        except Exception as e: 
            print(e)
            result = donationItemPackage("","failure","")
        result = jsonpickle.encode(result,unpicklable=False)
        return result

#function to create a requirement
def createRequirement(request,es):
    if request.method == "POST":
        try:
            
              
            date = datetime.datetime.now(datetime.timezone.utc)
            query = {
                        "docType":"requirement",
                        "category":request.form["category"],
                        "subCategory":request.form["subcategory"],
                        "itemName":request.form["name"],
                        "details":request.form["details"],
                        "quantity":int(request.form["quantity"]),
                        "ngoId":request.form["ngoId"],
                        "pincode":request.form["pincode"],
                        "ngoName":request.form["ngoName"],
                        "publicFlag": "true",
                        "date":date
                    }            
            res = es.index(index="donations", body=(query))
            
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't create requirement"),unpicklable=False)
        return json.dumps({"status":"Success","requirementId":res["_id"]})

#function to accept or decline a donation
def acceptDeclineDonation(request,es):
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            donorId = data["donorId"]
            ngoId = data ["ngoId"]
            requirementId = data["requirementId"]
            itemId = data["itemId"]
            actionToken = data["actionTaken"]
            res = es.search(index="accounts",body={"query":{"term":{"_id":ngoId}}})
            ngoName = res["hits"]["hits"][0]["_source"]["ngoName"]
            quantity = data["quantity"]
            date = datetime.datetime.now(datetime.timezone.utc)
            if actionToken == "accept":
                query1 = {
                             "docType": "update",
                            "updateType": "acceptDonation",
                            "ngoId" : ngoId,
                            "ngoName" : ngoName,
                            "donorId" : donorId,
                            "itemId": itemId,
                            "requirementId": requirementId,
                            "date":date
                        }
                res1 = es.index(index="donations",body=(query1))
        
                #updating the quantity
                source = "ctx._source.quantity -= %d"%(int(quantity))
                query = {
                    "script" : {
                        "source" : source
                    }
                }
                res3 = es.update(index="donations" , id = requirementId , body = (query))
                res4 = es.update(index="donations" , id = itemId , body = (query))
                return jsonpickle.encode(responsePackage("success","Accepted donation"),unpicklable=False)
               
            elif actionToken == "decline":
                query1 = {
                            "docType": "update",
                            "updateType": "declineDonation",
                            "ngoId" : ngoId,
                            "ngoName" : ngoName,
                            "donorId" : donorId,
                            "itemId": itemId,
                            "requirementId": requirementId,
                            "date":date
                        }
                result = es.index(index="donations",body=(query1))
                return jsonpickle.encode(responsePackage("success","Declined donation"),unpicklable=False)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't respond to donation"),unpicklable=False)

#function to delete a requirement
def deleteRequirement(request, es):
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            reqId = data["requirementId"]
            ngoId = data["ngoId"]
            #chnging quantity to 0
            res1 = es.update(index = "donations", id = reqId, body = {"script" : {"source": "ctx._source.quantity = 0"}})
            #setting publicFlag to false
            res1 = es.update(index = "donations", id = reqId, body = {"script" : {"source": "ctx._source.publicFlag = false"}})
            #get all updates for that requirement Id
            res2 = es.search(index = "donations", body ={"query": {"bool":{"must": [{ "term" : { "updateType" : "donateRequest" } },{ "term" : {"requirementId" : reqId} }]}}})
            requirementList = []
            for item in res2["hits"]["hits"]:
                if "requirementId" in item["_source"]:
                    requirementList.append(item["_source"])
            # print(requirementList)
            #setting updateType as itemDeleted for each requirement Id
            if len(requirementList) > 0:
                for requirement in requirementList:
                    #obtaining NGO Name
                    res = es.search(index="accounts",body={"query":{"term":{"_id":requirement["ngoId"]}}})
                    ngoName = res["hits"]["hits"][0]["_source"]["ngoName"]
                    query = {
                        "docType":"update",
                        "updateType":"requirementDeleted",
                        "ngoId":requirement["ngoId"],
                        "requirementId":requirement["requirementId"],
                        "ngoName":ngoName,
                        "itemId":requirement["itemId"],
                        "donorId": requirement["donorId"],
                        "date": datetime.datetime.now(datetime.timezone.utc)
                    }
                    res1 = es.index(index="donations",body=(query))
            else:
                #donorId and requirement id will be blank
                query = {
                        "docType":"update",
                        "updateType":"requirementDeleted",
                        "ngoId":ngoId,
                        "requirementId":reqId,
                        "ngoName":"",
                        "itemId":"",
                        "donorId": "",
                        "date": datetime.datetime.now(datetime.timezone.utc)
                    }
                res = es.index(index="donations",body=(query))
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't delete requirement"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Deleted requirement Successfully"),unpicklable=False)

#function to get updates for NGO
def getUpdatesForNGO(request,es):
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            ngoId = data["ngoId"]

            res = es.search(index = "donations", body={"size": 10000,"sort":{"date" : "asc"},"query":{"bool": {"must": [{ "term" : { "ngoId": ngoId } }],"should": [{ "term" : { "docType": "requirement" } },{ "term" : { "docType": "update" } }],"minimum_should_match": 1}}})
            
            #print(res["hits"]['hits'])
            result = []
            count = 0
            
            
            for obj in res["hits"]['hits']: 
                
                if obj["_source"]["docType"] == "requirement":
                    count = count + 1
                    item = {
                        "Requirement"+str(count) : {
                            "reqId" : obj["_id"],
                            "reqName" : obj["_source"]["itemName"],
                            "reqCategory" : obj["_source"]["category"],
                            "reqSubcategory" : obj["_source"]["subCategory"],
                            "reqDetails":obj["_source"]["details"],
                            "reqQuantity" : obj["_source"]["quantity"],
                            "reqDate" : obj["_source"]["date"],
                            "reqUpdates" : []
                        }
                    }
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
                        itemQuantity = obj["_source"]["quantity"]
                    else:
                        itemQuantity = ""
                    if "quality" in obj["_source"]:
                        itemQuality = obj["_source"]["quality"]
                    else:
                        itemQuality = ""
                    
                    itemImgLink = ""
                    if "imageLink" in obj["_source"]:
                        itemImgLink = obj["_source"]["imageLink"]
                        
                    pincode = ""
                    if "pincode" in obj["_source"]:
                        pincode = obj["_source"]["pincode"]
                    
                    if "messageFrom" in obj["_source"]:
                        messageFrom = obj["_source"]["messageFrom"]
                    else:
                        messageFrom = ""
                    
                    date = ""
                    if "date" in obj["_source"]:
                        date = obj["_source"]["date"]
                    #because message field is details in backend so check if type message then set message otherwise assign details to details var
                    message = ""
                    imageLink="-1"
                    if updateType=="message":
                        if "details" in obj["_source"]:
                            message = obj["_source"]["details"]
                        if "imageLink" in obj["_source"]:
                            imageLink=obj["_source"]["imageLink"]
                            
                    else:
                        if "details" in obj["_source"]:
                            itemDetails = obj["_source"]["details"]
                        else:
                            itemDetails = ""
                    
                    
                    
                    update = {
                        "updateType":updateType,
                        "itemId":itemId,
                        "reqId":reqId,
                        "donorId":donorId,
                        "ngoId":ngoId,
                        "itemQuantity":itemQuantity,
                        "itemImageLink":itemImgLink,
                        "itemQuality":itemQuality,
                        "itemDetails":itemDetails,                        
                        "messageFrom":messageFrom,
                        "message":message,
                        "pincode":pincode,
                        "updateDate":date,
                        "imageLink":imageLink #for message Image
                    }
                    
                    
                    count = 0
                    for item in result:
                        count = count + 1
                        if item["Requirement"+str(count)]["reqId"] == reqId:
                            item["Requirement"+str(count)]["reqUpdates"].append(update)
            #adding noupdate string for which no updates are present
            count=0
            for item in result:
                count=count+1
                if len(item["Requirement"+str(count)]["reqUpdates"])==0:
                    update = {
                        "updateType" :"noupdate"
                         
                    }
                    item["Requirement"+str(count)]["reqUpdates"].append(update)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't fetch updates for NGO"),unpicklable=False)
          
    return json.dumps({"updatesForNGO":result})

#function to mark an item as received 
def markItem(request,es):
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            donorId = data["donorId"]
            ngoId = data ["ngoId"]
            requirementId = data["requirementId"]
            itemId = data["itemId"]
            #getting NgoName
            res = es.search(index="accounts",body={"query":{"term":{"_id":ngoId}}})
            ngoName = res["hits"]["hits"][0]["_source"]["ngoName"]
            date = datetime.datetime.now(datetime.timezone.utc)
            print (ngoName)
            query = {
                "docType": "update",
                "updateType": "received",
                "ngoId" : ngoId,
                "ngoName" : ngoName,
                "donorId" : donorId,
                "itemId": itemId,
                "requirementId": requirementId,
                "date": date
            }
            res = es.index(index = "donations",body =(query))

            message = "Remember to let the donor know how their donation is being used"

            createAlert(ngoId,date,date,message,donorId,ngoId,itemId,requirementId,"message",es)
            messaage= "Rate the donor"
            #createAlert(ngoId,date,date,message,donorId,ngoId,itemId,requirementId,"rate",es)
            createAlert(donorId,date,date,message,donorId,ngoId,itemId,requirementId,"rate",es)



            # print(query)
        except Exception as e:
            print (e)
            return jsonpickle.encode(responsePackage("Error","Couldn't mark item as received"),unpicklable=False)
        return jsonpickle.encode(responsePackage("success","Item marked as received"),unpicklable=False)
