from flask import Flask, request, url_for , redirect , send_from_directory
from flask_cors import CORS
from ssl import create_default_context
from elasticsearch import Elasticsearch
import json
import jsonpickle
import datetime
from werkzeug.utils import secure_filename
import os
from os import listdir
from os.path import isfile, join
app = Flask(__name__)

#defining the default temporary upload folder
# UPLOAD_FOLDER = './Upload_folder'
app.config['UPLOAD_FOLDER'] = './Upload_folder'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app.add_url_rule('/uploads/<filename>', 'uploaded_file',
                 build_only=True)
# app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
#     '/uploadFile':  app.config['UPLOAD_FOLDER']

CORS(app) #Used to disable cross origin policy to test app in local
#connecting to the elasticsearch cluster
try: 
    #es = Elasticsearch(
     #          ['https://90266fa352184992b46b503574f1132e.ap-south-1.aws.elastic-cloud.com:9243/'],
      #         http_auth=("elastic","HR9Cc5vxZXTwwU8auCrrBgJC"),
       #         scheme = "https",
        #        )



    #using new db for testing functionalities
    es = Elasticsearch(
               ['https://5ea0807d2db24793b2ae5f6ee4f413bd.ap-south-1.aws.elastic-cloud.com:9243'],
               http_auth=("elastic","JEjJFXwITPboNUxEIcnxwsYs"),
                scheme = "https",
                )
    print("Connected")
except Exception as e: 
    print(e) 
    print ("Error in connection")

#class to define a donation Item object
class donationItem:
    def __init__(self,itemId,name,category,subcategory,details,quantity,quality,imglink):
        self.itemId = itemId
        self.name = name
        self.category = category
        self.subcategory = subcategory
        self.details = details
        self.quantity = quantity
        self.quality = quality
        self.imgLink = imglink

#class to define an item requirement object
class itemRequirement:
     def __init__(self,ID,name,category,subcategory,details,quantity,ngoId,ngo):
        self.ID =ID
        self.name = name
        self.category = category
        self.subcategory = subcategory
        self.details = details
        self.quantity = quantity
        self.ngoId = ngoId
        self.ngo = ngo
#class to define unverifiedNgo object
class ngo:
    def __init__(self,ngoId,name,email,phone,pan,address,pincode):
        self.ngoId = ngoId
        self.name = name
        self.email = email
        self.phone = phone
        self.pan = pan
        self.address = address
        self.pincode = pincode

class ngoPackage:
    def __init__(self,ngoList,status,message):
        self.ngoList = ngoList
        self.status = status
        self.message = message

class donationItemPackage:
    def __init__(self,donationItems,status,message):
        self.donationItems = donationItems
        self.status = status
        self.message = message

class itemRequirementPackage:
    def __init__(self,itemRequirements,status,message):
        self.itemRequirements = itemRequirements
        self.status = status
        self.message = message

class responsePackage:
    def __init__(self,status,message):
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

#AUTH Utilities
#function to create a Donor account
@app.route("/createUserAccount",methods=['POST','GET'])
def createUserAccount():
    if request.method == "POST":
        try:
            # print (request.data)
            data = json.loads(request.data)
            email = data ["email"]
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
                        "name":data["name"],
                        "passwordHash":data["password"],
                        "address":data["address"],
                        "phone":data["email"],
                        "email":data["email"],
                        "pincode":data["pincode"],
                        "userType":data["userType"],
                        "numberOfRatings":data["numberOfRatings"],
                        "averageRating":data["averageRating"]
                        }
                
                res = es.index(index = "accounts", body = query)
                result = responsePackage("Success","User created successfully")
                result = jsonpickle.encode(responsePackage)
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't create user"),unpicklable=False)
        return result

#function to create an NGO account
@app.route("/createNgoAccount",methods=['POST'])
def createNgoAccount():
    if request.method == "POST":
        try:
            # print (request.data)
            data = json.loads(request.data)
            email = data ["email"]
            # print (data)
            query = '{"query":{"term":{"email": "%s"}}}'%(email)
            emailExists = es.search(index="accounts", body=query)
            value = emailExists["hits"]["total"]["value"]
            if value >= 1:
                result = responsePackage("Error","Couldn't create ngo account")
                result = jsonpickle.encode(result)
                return result
            else :
            #commenting it out because new architecture requires the field to be missing to check for unverified ngos
                #data["verifiedNgoFlag"] = "false" 
                query = {
                    "ngoName":data["name"],
                    "address":data["address"],
                    "email":data["email"],
                    "phone":data["phone"],
                    "website":data["website"],
                    "pincode":data["pincode"],
                    "passwordHash":data["password"],
                    "userType":"NGO",
                    "pan":data["panno"],
                    "description":data["description"]
                    
                }
                
                res = es.index(index = "accounts", body = query)
                result = responsePackage("Success","Ngo Account created successfully")
                result = jsonpickle.encode(result)
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Couldn't create ngo account"),unpicklable=False)
        return result

#function to get Ngo Details 
@app.route("/getNgoInfo",methods=['GET']) 
def getNgoInfo():
    if request.method=="GET":
        try:
            data = json.loads(request.data)
            ngoId = data["ngoId"]
            res = es.search(index = "accounts", body={"query":{"term":{"_id":ngoId}}})
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
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't get NGO Information"),unpicklable=False)
        return ngoInfo

#function for user/ngo authentication
@app.route("/authenticate",methods=['POST'])
def authentication():
    es_updated = Elasticsearch(
               ['https://5ea0807d2db24793b2ae5f6ee4f413bd.ap-south-1.aws.elastic-cloud.com:9243'],
               http_auth=("elastic","JEjJFXwITPboNUxEIcnxwsYs"),
                scheme = "https",
                )
    if request.method == "POST": 
    #Changed to only allow post reqs by Abhinav -> passwords to be sent inside body of post req's since that is better than sending it in the URI itself.
        try:
            data = json.loads(request.data)
            email = data['email']
            password = data['password']
            query = '{"query":{"term":{"email": "%s"}}}'%(email)
            res = es_updated.search(index="accounts", body=query)
            if res["hits"]['total']['value'] > 0:
                passwordActual = res["hits"]['hits'][0]['_source']['passwordHash']
                if password == passwordActual:
                    userType = res["hits"]['hits'][0]['_source']['userType']
                    userId = res["hits"]['hits'][0]['_id']
                    if userType == 'donor':
                        verified = True
                        result = {
                        "role" : userType,
                        "id" : userId,
                        "verified" : verified,
                        "pass" : True,
                        "name": res["hits"]['hits'][0]['_source']['name'],
                        "email":res["hits"]['hits'][0]['_source']['email'],
                        "address":res["hits"]['hits'][0]['_source']['address'],
                        "phone":res["hits"]['hits'][0]['_source']['phone'],
                        "pincode":res["hits"]['hits'][0]['_source']['pincode']
                        } 
                    elif userType=='NGO':
                        if 'verifiedNgoFlag' in res["hits"]['hits'][0]['_source'] and res["hits"]['hits'][0]['_source']['verifiedNgoFlag'] == "true":
                            verified = True
                        else:
                            verified = False
                        result = {
                            "role" : userType,
                            "id" : userId,
                            "verified" : verified,
                            "pass" : True,
                            "ngoName" : res["hits"]['hits'][0]['_source']['ngoName'],
                            "email":res["hits"]['hits'][0]['_source']['email'],
                            "pan":res["hits"]['hits'][0]['_source']['pan'],
                            "address":res["hits"]['hits'][0]['_source']['address'],
                            "website":res["hits"]['hits'][0]['_source']['website'],
                            "phone":res["hits"]['hits'][0]['_source']['phone'],
                            "pincode":res["hits"]['hits'][0]['_source']['pincode']
                            
                        } 
                    elif userType=='admin':
                        result ={
                            "role":userType,
                            "id":userId,
                            "pass":True
                        }
                    result = json.dumps(result)
                    
                   
                else:
                    result = {
                        "role" : None,
                        "id" : None,
                        
                        "verified" : None,
                        "pass" : False
                        } 
                    result = json.dumps(result)
                    return result
            else: 
                print("No data found")
                result = {
                        "role" : None,
                        "id" : None,
                       
                        "verified" : None,
                        "pass" : None
                        } 
                return result
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Error","Something failed while authenticating"),unpicklable=False)
        return str(result)


##ADMIN Utilities
#function to get all unverififed NGOs
@app.route("/getUnverifiedNgoList",methods=['POST','GET'])
def getNgoList():
    if request.method == "GET":
        try:
            res = es.search(index="accounts", body={"query":{"bool":{"must":{"term" : {"userType" : "NGO"  }},"must_not":{"term" : { "verifiedNgoFlag" : "true" }}}}})
            
            ngoList = []
            for item in res["hits"]['hits']:
                ngoList.append(ngo(item['_id'],item['_source']['ngoName'],item['_source']['email'],item['_source']['phone'],item['_source']['pan'],item['_source']['address'],item['_source']['pincode']))
            
            
            res = ngoPackage(ngoList,"Success","Fetched all items")
        except Exception as e: 
            print(e)
            return jsonpickle.encode(ngoPackage([],"Failure","error occured"),unpicklable=False)
        return jsonpickle.encode(res,unpicklable=False)

#function to approve or reject an NGO by admin (to mark NGO as verified)
@app.route("/approve_reject_NGO",methods=['POST'])
def approveRejectNGO():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            actionToken = data["actionTaken"]
            ngoId = data ["id"]
            print (actionToken)
            if actionToken == 'accept':
                res = es.update(index = "accounts", id = ngoId, body = {"doc": {"verifiedNgoFlag": "true"}})
            elif actionToken == 'reject':
                res = es.delete(index = "accounts", id = ngoId)
        except Exception as e:
            print (e)
            return jsonpickle.encode(responsePackage("Error","Couldn't perform action"),unpicklable=False)
        return res


##NGO Utilities
#function to request an item
@app.route("/requestItem",methods=['POST'])
def requestItem():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            #del data["itemId"]
            print(data)
           
            category = data["category"]
            subCategory = data["subcategory"]
            name = data["name"]
            details = data["details"]
            quantity = data["quantity"]
            pincode = data["pincode"]
            ngoId = data["ngoId"]
            itemId = data["itemId"]
            public = data["public"]
            ngoName = data["ngoName"]
            print(itemId)
            
            print("Query=",query)
            
            
            date = datetime.datetime.now(datetime.timezone.utc) #changed to using utc format or else time and date will be different for users living in different areas
            query = {
                        "docType":"requirement",
                        "category":category,
                        "subCategory":subCategory,
                        "itemName":name,
                        "details":details,
                        "quantity":quantity,
                        "ngoId":ngoId,
                        "ngoName":ngoName,
                        "pincode":pincode,
                        "publicFlag":public,
                        "date":date
                    }
            res = es.index(index="donations", body=(query))
            requirementID = res["_id"]  
            
            #Also get donorId from Item
            res = es.get(index="donations", id=itemId)
            donorId = res["_source"]["donorId"]
            
            query = {"docType":"update","updateType":"donateRequest","ngoId":ngoId,"itemId":itemId,"donorId":donorId,"requirementId":requirementID,"date":date,"details":details,"ngoName":ngoName,"pincode":pincode}
            result = es.index(index="donations", body=query)
            response = responsePackage("Success","Requested Item")
        except Exception as e: 
            print(e)
            print("Error in request item function")
            response = responsePackage("Failure","Something went wrong")
        response =jsonpickle.encode(response,unpicklable=False)
        return response

#fn to test code
@app.route("/test",methods=['POST'])
def test():
    if request.method =='POST':
        #itemId = json.loads(request.data)["itemId"]
        #res = es.get(index="donations", id=itemId)
       

#       ID=json.loads(request.data)["ID"]
 #       res = es.update(index="donations",id = ID, body = {"doc": {"ngoName":json.loads(request.data)["ngoName"]}})
        res=""
        return res
        
        
    
#function to get all items (For NGO)
@app.route("/getItems",methods=['POST','GET'])
def getItems():
    if request.method == "GET":
        try:
            res = es.search(index="donations", body={"query":{"bool":{"must": [{"term" : {"docType" : "item" }},{"term":{"publicFlag":"true"}}],"must_not": [{"term" : {"donatedFlag": "true" }}]}}})
            print(res["hits"]['hits'])
            dataList = []
            for item in res["hits"]['hits']:
                ID = item['_id']
                imglink = ""
                try:
                    path = './Upload_folder'
                    fileist = [f for f in listdir(path) if isfile(join(path, f))]
                    for f in fileist:
                        if f.split('.')[0] == ID:
                            imglink = "/uploads/" + f
                            break
                    print(imglink)
                except Exception as e:
                    print("error in finding file")
                    print(e)
                dataList.append(donationItem(item['_id'],item['_source']['itemName'],item['_source']['category'],item['_source']['subCategory'],item['_source']['details'],item['_source']['quantity'],item['_source']['quality'],imglink))
            for obj in dataList:
                print(obj.name)
            result = donationItemPackage(dataList,"success","object contains list of items up for donation")
        except Exception as e: 
            print(e)
            result = donationItemPackage("","failure","")
        result = jsonpickle.encode(result,unpicklable=False)
        return result
#function to create a requirement
@app.route("/createPublicRequirement",methods=['POST','GET'])
def createRequirements():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
              
            date = datetime.datetime.now(datetime.timezone.utc)
            query = {
                        "docType":"requirement",
                        "category":data["category"],
                        "subCategory":data["subcategory"],
                        "itemName":data["name"],
                        "details":data["details"],
                        "quantity":data["quantity"],
                        "ngoId":data["ngoId"],
                        "pincode":data["pincode"],
                        "ngoName":data["ngoName"],
                        "publicFlag": "true",
                        "date":date
                    }            
            res = es.index(index="donations", body=(query))
            
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't create requirement"),unpicklable=False)
        return json.dumps({"status":"Success","requirementId":res["_id"]})

#changing function name as this deletes the entire requirement document
#Need to think about handling side effects too i.e how to handle updates for the requests made to these delete items/requirements    
@app.route("/deleteRequirementDocument",methods=['POST','GET'])    
def deleteRequirementDocument():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            reqId = data["requirementId"]
            res = es.delete(index = "donations", id = reqId)
            print(res)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't delete requirement"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Deleted Requirement Successfully"),unpicklable=False)

##DONOR Utilities
#function to donate an item 
@app.route("/donateItemPublic",methods=['POST'])
def donateItem():
    if request.method == "POST":
        try:
            category = request.form["category"]
            subcategory = request.form["subcategory"]
            itemname = request.form["name"]
            details = request.form["details"]
            quantity = request.form["quantity"]
            quality = request.form["quality"]
            donorID = request.form["donorId"]
            pincode = request.form["pincode"]
            date = datetime.datetime.now(datetime.timezone.utc)
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
                        "date":date
                    }
                    
            res = es.index(index="donations", body=(query))
            ID = res["_id"]
            try:
                f = request.files['image']
                filename = ID + '.' + f.filename.split('.')[1]
                print(filename)
                f.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
                #Update item created with ImgLink
                res = es.update(index = "donations", id = ID, body = {"doc": {"imageLink":"/uploads/"+ID}})
            except:
                print("error in image upload")
                return jsonpickle.encode(responsePackage("Failure","Error in image upload"),unpicklable=False)
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Could not create an item"),unpicklable=False)
        return jsonpickle.encode(responsePackage("success","Item created"),unpicklable=False)
        


#function to get all public requirements
@app.route("/getRequirements",methods=['POST','GET'])
def getRequirements():
    if request.method == "GET":
        try:
        #TODO FOR SRIRAM -> CHECK PUBLIC FLAG HERE for true otherwise it will get all requests
            res = es.search(index="donations", body={"query":{"bool":{"must": [{"term" : {"docType" : "requirement" }},{"range" : {"quantity" : { "gte" : 0}}}]}}})
            print(res["hits"]['hits'][0]['_source']['details'])
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
                dataList.append(itemRequirement(item['_id'],item['_source']['itemName'],item['_source']['category'],item['_source']['subCategory'],details,item['_source']['quantity'],item['_source']['ngoId'],ngo))
            # for obj in dataList:
                # print(obj.name)
            result = itemRequirementPackage(dataList,"success","object contains list of requirements")
        except Exception as e: 
            print(e)
            result = itemRequirementPackage("","failure","")
        result = jsonpickle.encode(result,unpicklable=False)
        return result


#function to respond to a requirement
@app.route("/respondToRequirement",methods=['POST'])
def respondToRequirement():
    if request.method == "POST":
        try:
            donorID = request.form['donorId']
            category = request.form['category']
            subcategory = request.form['subCategory']
            itemname = request.form['name']
            requirementID = request.form['requirementId']
            NGOID = request.form['ngoId']
            quantity = request.form['quantity']
            quality = request.form['quality']
            pincode = request.form['pincode']
            details = request.form['details']
            public = request.form['public']
            date = datetime.datetime.now(datetime.timezone.utc)
            query1 = {
                "doctype":"item",
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
                "date":date
            }
            result = es.index(index="donations", body=(query1))
            ID = result["_id"]
            try:
                f = request.files['image']
                filename = ID + '.' + f.filename.split('.')[1]
                f.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
                #Update item created with ImgLink
                res = es.update(index = "donations", id = ID, body = {"doc": {"imageLink":"/uploads/"+ID}})
            except:
                print("error in image upload in respond to requirement")
                return jsonpickle.encode(responsePackage("Failure","Error in image upload"),unpicklable=False)
            #get ngoName via ngoId
            res = es.search(index="accounts",body={"query":{"term":{"_id":NGOID}}})
            ngoName = res["hits"]["hits"][0]["_source"]["ngoName"]
            imageLink = "/uploads/"+ID
            query2 = {
                "docType":"update",
                "updateType":"donate",
                "ngoId":NGOID,
                "requirementId":requirementID,
                "donorId":donorID,
                "itemId":ID,
                "date":date,
                "ngoName":ngoName,
                "quantity":quantity,
                "quality":quality,
                "pincode":pincode,
                "imageLink": imageLink
            }
            res = es.index(index="donations", body=(query2))
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Error in respond to requirement"),unpicklable=False)
        return jsonpickle.encode(responsePackage("success","Responded to requirement successfully"),unpicklable=False)

@app.route("/respondToDonationRequest",methods=['POST'])    
def respondToDonationRequest():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            ngoId = data["ngoId"]
            ngoName = data["ngoName"]
            itemId = data["itemId"]
            donorId = data["donorId"]
            reqId = data["requirementId"],
            actionTaken = data["actionTaken"] #Added actionTaken by Donor (accept/decline)
            date = datetime.datetime.now(datetime.timezone.utc)
            
            if actionTaken == "accept":
                query1 = {
                    "docType":"update",
                    "updateType":"accept",
                    "ngoId":ngoId,
                    "ngoName" : ngoName,
                    "itemId" : itemId,
                    "donorId" : donorId,
                    "requirementId" : reqId,
                    "date": date
                }
            
                
                #adding document with updateType "accept"
                result1 = es.index(index = "donations", body = (query1))
                #setting donatedFlag to true
                result2 = es.update(index = "donations", id = reqId, body = {"doc": {"donatedFlag": "true"}})
                #getting remaining NGOs and setting updateType "decline"
                ngoList = es.search(index="donations" , body = {"query":{"bool":{"must": [{ "term" : { "updateType": "donateRequest" } },{ "term" : { "itemId": itemId }}]}}})
                # print(ngoList)
                for ngo in ngoList["hits"]["hits"]:
                    if ngo["_source"]["ngoId"] != ngoId:
                        query = {
                        "docType":"update",
                        "updateType":"decline",
                        "ngoId":ngo["_source"]["ngoId"],
                        "itemId" : itemId,
                        "donorId" : donorId,
                        "requirementId" : reqId,
                        "date": date
                        }
                        if "ngoName" in ngo["_source"]:
                            query["ngoName"] = ngo["_source"]["ngoName"]
                        res = es.index(index = "donations", body = (query1))
                #updating the quantites
                requirement = es.search(index = "donations", body = {"query": {"term": {"_id": reqId}}})
                reqQuantity = requirement["hits"]["hits"][0]["_source"]["quantity"]
                # print(reqQuantity)
                item = es.search(index = "donations", body = {"query": {"term": {"_id": itemId}}})
                itemQuantity = item["hits"]["hits"][0]["_source"]["quantity"]
                # print(itemQuantity)
                finalQuantity = reqQuantity - itemQuantity
                source = "ctx._source.quantity = %s"%(str(finalQuantity))
                result3 = es.update(index="donations" , id = reqId , body = {"script" : {"source": source}})
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
                    "date": date
                }           
                #adding document with updateType "decline"
                result1 = es.index(index = "donations", body = (query1))
                # return result1
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't respond to donation request"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Responded to donation request"),unpicklable=False)   
        #return result3
        
#function to upload a file
# @app.route("/uploadFile",methods=['POST'])
# def uploadFile():
#     if request.method == "POST":
#         try:
#             f = request.files['file']
#             filename = secure_filename(f.filename)
#             f.save(os.path.join(app.config['UPLOAD_FOLDER'],secure_filename(f.filename)))
#             print('file uploaded successfully')
#             print(url_for('uploaded_file',filename=filename))
#             return redirect(url_for('uploaded_file',filename=filename))
#         except Exception as e:
#             print(e)
#             return "Error in file upload"

#endpoint that returns the image once hit with the url and filename

#function for and NGO to accept or decline a donation request 
@app.route('/accept_decline_donation',methods=['POST'])
def acceptDeclineDonation():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            donorId = data["donorId"]
            ngoId = data ["ngoId"]
            requirementId = data["requirementId"]
            itemId = data["itemId"]
            actionToken = data["actionToken"]
            res = es.search(index="accounts",body={"query":{"term":{"_id":ngoId}}})
            ngoName = res["hits"]["hits"][0]["_source"]["ngoName"]
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
                #updating donated flag
                res2 = es.update(index = "donations", id = itemId, body = {"doc": {"donatedFlag": "true"}})
                #updating the quantity
                item = es.search(index = "donations", body = {"query": {"term": {"_id": itemId}}})
                itemQuantity = item["hits"]["hits"][0]["_source"]["quantity"]
                source = "ctx._source.quantity -= %d"%(itemQuantity)
                res3 = es.update(index="donations" , id = requirementId , body = {"script" : {"source": source}})
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

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    url = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'])
    return send_from_directory(url,
                               filename)


#function to remove document (Changine name from deleteItem to deleteDocument)
@app.route("/deleteDocument",methods=['POST','GET'])    
def deleteDocument():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            itemId = data["itemId"]
            res = es.delete(index = "donations", id = itemId)
            print(res)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't delete document"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Deleted document Successfully"),unpicklable=False)   

#function to delete item
@app.route("/deleteItem",methods=['POST'])    
def deleteItem():
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
            print(requirementList)
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


#function to delete requirement
@app.route("/deleteRequirement",methods=['POST'])    
def deleteRequirement():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            reqId = data["requirementId"]
            ngoId = data["ngoId"]
            #chnging quantity to 0
            res1 = es.update(index = "donations", id = reqId, body = {"script" : {"source": "ctx._source.quantity = 0"}})
            #get all updates for that requirement Id
            res2 = es.search(index = "donations", body ={"query": {"bool":{"must": [{ "term" : { "updateType" : "donateRequest" } },{ "term" : {"requirementId" : reqId} }]}}})
            requirementList = []
            for item in res2["hits"]["hits"]:
                if "requirementId" in item["_source"]:
                    requirementList.append(item["_source"])
            print(requirementList)
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

@app.route("/getUpdatesForDonor",methods=['POST'])    
def getUpdatesForDonor():
    if request.method=="POST":
        try:
            es_updated = Elasticsearch(
               ['https://5ea0807d2db24793b2ae5f6ee4f413bd.ap-south-1.aws.elastic-cloud.com:9243'],
               http_auth=("elastic","JEjJFXwITPboNUxEIcnxwsYs"),
                scheme = "https",
                )
            data = json.loads(request.data)
            donorID = data["donorId"]
            res = es_updated.search(index = "donations", body={"size": 10000,"sort":{"date" : "asc"},"query":{"bool": {"must": [{ "term": { "donorId" : donorID}}],"should": [{ "term" : { "docType": "item" } },{ "term" : { "docType": "update" } }],"minimum_should_match": 1}}})
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
                            "itemUpdates" : []
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
                        "date":date
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

#TODO Refer to my getUpdatesForDonor and send me back the response in a similar manner.
@app.route("/getUpdatesForNGO",methods=['POST'])    
def getUpdatesForNGO():
    es_updated = Elasticsearch(
               ['https://5ea0807d2db24793b2ae5f6ee4f413bd.ap-south-1.aws.elastic-cloud.com:9243'],
               http_auth=("elastic","JEjJFXwITPboNUxEIcnxwsYs"),
                scheme = "https",
                )
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            ngoId = data["ngoId"]

            res = es_updated.search(index = "donations", body={"size": 10000,"sort":{"date" : "asc"},"query":{"bool": {"must": [{ "term" : { "ngoId": ngoId } }],"should": [{ "term" : { "docType": "requirement" } },{ "term" : { "docType": "update" } }],"minimum_should_match": 1}}})
            
            #print(res["hits"]['hits'])
            result = []
            count = 0
            
            print(res)
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
                    
                    #requirementID = obj["_source"]["_id"]
                    # updateType,itemId,reqId,ngoId,donorId,itemQuantity,itemQuality,itemDetails,messageFrom,message
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
                        donorId = ""
                    if "quantity" in obj["_source"]:
                        itemQuantity = obj["_source"]["quantity"]
                    else:
                        itemQuantity = ""
                    if "quality" in obj["_source"]:
                        itemQuality = obj["_source"]["quality"]
                    else:
                        itemQuality = ""
                    itemImgLink = ""
                    if "itemImageLink" in obj["_source"]:
                        itmImgLink = obj["_source"]["itemImageLink"]
                        
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
                    details = ""
                    if updateType=="message":
                        if "details" in obj["_source"]:
                            message = obj["_source"]["details"]
                        else:
                            message = ""
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
                        "date":date
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


#Function to mark an item as received
@app.route("/markItem",methods=['POST'])
def markItem():
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
            print(query)
        except Exception as e:
            print (e)
            return jsonpickle.encode(responsePackage("Error","Couldn't mark item as received"),unpicklable=False)
        return jsonpickle.encode(responsePackage("success","Item marked as received"),unpicklable=False)

#function to send a message TO-ngo FROM-Donor
@app.route("/sendMessageToNgo",methods=['POST'])    
def sendMessageToNgo():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            message = data["message"]
            reqId = data["requirementId"]
            ngoId = data ["ngoId"]
            itemId = data["itemId"]
            donorId  = data["donorId"]
            query = {
                "docType" : "update",
                "updateType" : "message",
                "details": message,
                "requirementId": reqId,
                "donorId": donorId,
                "ngoId" : ngoId,
                "itemId" : itemId,
                "messageFrom": "donor",
                "date": datetime.datetime.now(datetime.timezone.utc)
            }
            res = es.index(index = "donations", body =(query))
            print(res)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't send message to NGO"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Message sent to NGO"),unpicklable=False)

#function to send message TO-Donor from NGO
@app.route("/sendMessageToDonor",methods=['POST'])    
def sendMessageToDonor():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            message = data["message"]
            reqId = data["requirementId"]
            ngoId = data ["ngoId"]
            itemId = data["itemId"]
            donorId  = data["donorId"]
            query = {
                "docType" : "update",
                "updateType" : "message",
                "details": message,
                "requirementId": reqId,
                "donorId": donorId,
                "ngoId" : ngoId,
                "itemId" : itemId,
                "messageFrom": "NGO",
                "date": datetime.datetime.now(datetime.timezone.utc)
            }
            res = es.index(index = "donations", body =(query))
            print(res)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't send message to donor"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Message sent to donor"),unpicklable=False)  
        
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
    
    
    
 