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
    es = Elasticsearch(
                ['https://90266fa352184992b46b503574f1132e.ap-south-1.aws.elastic-cloud.com:9243/'],
                 http_auth=("elastic","HR9Cc5vxZXTwwU8auCrrBgJC"),
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
                    "pan":data["panno"]                    
                    
                }
                
                res = es.index(index = "accounts", body = query)
                result = responsePackage("Success","Ngo Account created successfully")
                result = jsonpickle.encode(result)
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Couldn't create ngo account"),unpicklable=False)
        return result


#function for user/ngo authentication
@app.route("/authenticate",methods=['POST'])
def authentication():
    if request.method == "POST": 
    #Changed to only allow post reqs by Abhinav -> passwords to be sent inside body of post req's since that is better than sending it in the URI itself.
        try:
            data = json.loads(request.data)
            email = data['email']
            password = data['password']
            query = '{"query":{"term":{"email": "%s"}}}'%(email)
            res = es.search(index="accounts", body=query)
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
                    else:
                        if 'VerifiedNGOFlag' in res["hits"]['hits'][0]['_source'] and res["hits"]['hits'][0]['_source']['VerifiedNGOFlag'] == "true":
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
                            "phone":res["hits"]['hits'][0]['_source']['phone']
                            
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

#function to approve or reject an NGO by admin
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
            
            query = {"docType":"update","updateType":"donateRequest","ngoId":ngoId,"itemId":itemId,"donorId":donorId,"requirementId":requirementID,"date":date}
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


#Need to think about handling side effects too i.e how to handle updates for the requests made to these delete items/requirements    
@app.route("/deleteRequirement",methods=['POST','GET'])    
def deleteRequirement():
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
            
            query2 = {
                "docType":"update",
                "updateType":"donate",
                "ngoId":NGOID,
                "requirementId":requirementID,
                "donorId":donorID,
                "itemId":ID,
                "quantity":quantity,
                "quality":quality,
                "date":date
            }
            res = es.index(index="donations", body=(query2))
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Error in respond to requirement"),unpicklable=False)
        return jsonpickle.encode(responsePackage("success","Responded to requirement successfully"),unpicklable=False)
        
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
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    url = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'])
    return send_from_directory(url,
                               filename)

@app.route("/deleteItem",methods=['POST','GET'])    
def deleteItem():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            itemId = data["itemId"]
            res = es.delete(index = "donations", id = itemId)
            print(res)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't delete item"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Deleted Item Successfully"),unpicklable=False)      


@app.route("/getUpdatesForDonor",methods=['POST'])    
def getUpdatesForDonor():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            donorID = data["donorId"]
            res = es.search(index = "donations", body={"sort":{"date" : "asc"},"query":{"bool": {"must": [{ "term": { "donorId" : donorID}}],"should": [{ "term" : { "docType": "item" } },{ "term" : { "docType": "update" } }],"minimum_should_match": 1}}})
            # print(res["hits"]['hits'])
            result = []
            count = 0
            for obj in res["hits"]['hits']:
                count=count+1
                # print(obj["_source"]["docType"])
                if obj["_source"]["docType"] == "item":
                    item = {
                            "Item"+str(count): {
                            "itemId":    obj["_id"],
                            "itemName" : obj["_source"]["itemName"],
                            "itemCategory" : obj["_source"]["category"],
                            "itemSubcategory" : obj["_source"]["subCategory"],
                            "itemQuantity" : obj["_source"]["quantity"],
                            "itemQuality" :obj["_source"]["quality"],
                            "itemDetails" : obj["_source"]["details"],
                            "itemUpdates" : []
                        }
                    }
                    result.append(item)
                if obj["_source"]["docType"] == "update":
                #     if obj["_source"]["updateType"] == 'itemDeleted':
                #         update = "Deleted"
                #     elif obj["_source"]['updateType'] == 'received':
                #         update = "Donation Received"
                #     elif obj["_source"]['updateType'] == 'declineDonation':
                #         update = "Donation Rejected"
                #     elif obj["_source"]['updateType'] == 'acceptDonation':
                #         update = "Donation Accepted"
                #     elif obj["_source"]['updateType'] == 'NOTA':
                #         update = "available"
                #     else:
                #         update = obj["_source"]["updateType"]
                #     print(update)
                    update = {
                        "updateType" : obj["_source"]["updateType"],
                        "ngoName" : obj["_source"]["ngoName"],
                        "itemId" : obj["_source"]["itemId"],
                        "requirementId" : obj["_source"]["requirementId"]
                    }
                    itemID = obj["_source"]["itemId"]
                    count  = 0
                    print(result)
                    for item in result:
                        count=count+1
                        print(item)
                        print("count:"+str(count))
                        if item["Item"+str(count)]["itemId"] == itemID:
                            print("TEST")
                            
                            print(item["Item"+str(count)]["itemUpdates"])
                            item["Item"+str(count)]["itemUpdates"].append(update)
                
            #Add empty strings for items with no updates
            count=0
            for item in result:
                count=count+1
                if len(item["Item"+str(count)]["itemUpdates"])==0:
                    update = {
                        "updateType" : "noupdate",
                        "ngoName" : "noupdate",
                        "itemId" : "noupdate",
                        "requirementId" : "noupdate"
                    }
                    item["Item"+str(count)]["itemUpdates"].append(update)
                    
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't fetch updates for donor"),unpicklable=False)
        # return jsonpickle.encode(responsePackage("Success","Deleted Requirement Successfully"),unpicklable=False)   
        return json.dumps({"updatesForDonor":result})

#TODO Refer to my getUpdatesForDonor and send me back the response in a similar manner.
@app.route("/getUpdatesForNGO",methods=['POST'])    
def getUpdatesForNGO():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            ngoId = data["ngoId"]
            res = es.search(index = "donations", body={"sort":{"date" : "asc"},"query":{"bool": {"must": [{ "term" : { "ngoId": ngoId } }],"should": [{ "term" : { "docType": "requirement" } },{ "term" : { "docType": "update" } }],"minimum_should_match": 1}}})
            print(res["hits"]['hits'])
            result = []
            count = 0
            for obj in res["hits"]["hits"]:
                if obj["_source"]["docType"] == "requirement":
                    count = count + 1
                    item = {
                        "Requirement"+str(count) : {
                            "requirementId" : obj["_id"],
                            "itemName" : obj["_source"]["itemName"],
                            "category" : obj["_source"]["category"],
                            "subcategory" : obj["_source"]["subCategory"],
                            "quantity" : obj["_source"]["quantity"],
                            "requirementUpdates" : []
                        }
                    }
                    result.append(item)
                if obj["_source"]["docType"] == "update":
                    update = {
                        "updateType" : obj["_source"]["updateType"],
                        "ngoId" : obj["_source"]["ngoId"],
                        "itemId" : obj["_source"]["itemId"],
                        "requirementId" : obj["_source"]["requirementId"],
                    }
                    requirementID = obj["_source"]["requirementId"]
                    count = 0
                    for item in result:
                        count = count + 1
                        if item["Requirement"+str(count)]["requirementId"] == requirementID:
                            item["Requirement"+str(count)]["requirementUpdates"].append(update)
            #adding noUpdate string for which no updates are present
            count=0
            for item in result:
                count=count+1
                if len(item["Requirement"+str(count)]["requirementUpdates"])==0:
                    update = {
                        "updateType" : "noupdate",
                        "ngoId" : "noupdate",
                        "itemId" : "noupdate",
                        "requirementId" : "noupdate"
                    }
                    item["Requirement"+str(count)]["requirementUpdates"].append(update)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't fetch updates for NGO"),unpicklable=False)
          
    return json.dumps({"updatesForNGO":result})
        
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
    
    
    
 