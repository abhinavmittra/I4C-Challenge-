from flask import Flask, request, url_for,jsonify
from flask_cors import CORS
from ssl import create_default_context
from elasticsearch import Elasticsearch
import json
import jsonpickle
app = Flask(__name__)

CORS(app) #Used to disable cross origin policy to test app in local

#connecting to the elasticsearch cluster
try: 
    es = Elasticsearch(
                ['https://719f614d8e0d43d3b93ee3061d569f85.ap-south-1.aws.elastic-cloud.com:9243/'],
                 http_auth=("elastic","aRmYqD3NViBVdO8FWAaz55Ok"),
                 scheme = "https",
                )
    print("Connected")
except Exception as e: 
    print(e) 
    print ("Error in connection")

#class to define a donation Item object
class donationItem:
    def __init__(self,name,category,subcategory,details,quantity,quality):
        self.name = name
        self.category = category
        self.subcategory = subcategory
        self.details = details
        self.quantity = quantity
        self.quality = quality

#class to define an item requirement object
class itemRequirement:
     def __init__(self,name,category,subcategory,details,quantity,ngoId,ngo):
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
        self.ngoId = ngoId;
        self.name = name;
        self.email = email;
        self.phone = phone;
        self.pan = pan;
        self.address = address;
        self.pincode = pincode;
class donationItemPackage:
    def __init__(self,donationItem,status,message):
        self.donationItem = donateItem
        self.status = status
        self.message = message

class itemRequirementPackage:
    def __init__(self,itemRequirements,status,message):
        self.itemRequirements = itemRequirements
        self.status = status
        self.message = message

class ngoPackage:
    def __init__(self,ngoList,status,message):
        self.ngoList = ngoList;
        self.status = status;
        self.message = message;
class responsePackage:
    def __init__(self,status,message):
        self.status = status;
        self.message = message;

#function to get all accounts (NGO & Donor accounts)
# @app.route("/get_accounts",methods=['POST','GET'])
# def getAccounts():
#     if request.method == "GET":
#         try:
#             res = es.search(index="accounts", body={"query": {"match_all": {}}})
#         except Exception as e: 
#             print(e)
#             return "Error in getAccounts function"
#         return res

#function to get donation details
# @app.route("/get_donations",methods=['POST','GET'])
# def getDonation():
#     if request.method == "GET":
#         try:
#             res = es.search(index="donations", body={"query": {"match_all": {}}})
#         except Exception as e: 
#             print(e)
#             return "Error in getDonation function"
#         return res


#AUTH Utilities
#function to create a Donor account
@app.route("/createUserAccount",methods=['POST','GET'])
def createUserAccount():
    if request.method == "POST":
        try:
            # print (request.data)
            data = json.loads(request.data)
            email = data ["Email"]
            # print (data)
            query = '{"query":{"term":{"Email": "%s"}}}'%(email)
            emailExists = es.search(index="accounts", body=query)
            value = emailExists["hits"]["total"]["value"]
            if value >= 1:
                result = {"status" : "failure"}
                result = json.dumps(result)
                return result
            else: 
                res = es.index(index = "accounts", body = data)
                res = es.index(index = "accounts", body = data)
                result = {"status" : "success"}
                result = json.dumps(result)
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't create user"),unpicklable=False)
        return result

#function to create an NGO account
@app.route("/createNgoAccount",methods=['POST','GET'])
def createNgoAccount():
    if request.method == "POST":
        try:
            # print (request.data)
            data = json.loads(request.data)
            email = data ["Email"]
            # print (data)
            query = '{"query":{"term":{"Email": "%s"}}}'%(email)
            emailExists = es.search(index="accounts", body=query)
            value = emailExists["hits"]["total"]["value"]
            if value >= 1:
                result = {"status" : "failure"}
                result = json.dumps(result)
                return result
            else :
                res = es.index(index = "accounts", body = data)
                result = {"status" : "success"}
                result = json.dumps(result)
        except Exception as e: 
            print(e)
            return jsonpick.encode(responsePackage("Failure","Couldn't create ngo account"),unpicklable=False)
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
            query = '{"query":{"term":{"Email": "%s"}}}'%(email)
            res = es.search(index="accounts", body=query)
            # res = json.loads(res)
            if res["hits"]['total']['value'] > 0:
                passwordActual = res["hits"]['hits'][0]['_source']['PasswordHash']
                if password == passwordActual:
                    userType = res["hits"]['hits'][0]['_source']['UserType']
                    userId = res["hits"]['hits'][0]['_id']
                    if userType == 'donor':
                        verified = True
                    else:
                        if 'VerifiedNGOFlag' in res["hits"]['hits'][0]['_source'] and res["hits"]['hits'][0]['_source']['VerifiedNGOFlag'] == "true":
                            verified = True
                        else:
                            verified = False
                    result = {
                        "role" : userType,
                        "id" : userId,
                        "verified" : verified,
                        "pass" : True
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
            res = es.search(index="accounts", body={"query":{"bool":{"must":{"term" : {"UserType" : "NGO"  }},"must_not":{"term" : { "VerifiedNGOFlag" : "true" }}}}})
            
            ngoList = []
            for item in res["hits"]['hits']:
                ngoList.append(ngo(item['_id'],item['_source']['NGOName'],item['_source']['Email'],item['_source']['Phone'],item['_source']['PAN'],item['_source']['Address'],item['_source']['Pincode']))
            
            
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
                res = es.update(index = "accounts", id = ngoId, body = {"doc": {"VerifiedNGOFlag": "true"}})
            elif actionToken == 'reject':
                res = es.delete(index = "accounts", id = ngoId)
        except Exception as e:
            print (e)
            return jsonpickle.encode(responsePackage("Error","Couldn't perform action"),unpicklable=False)
        return res


##NGO Utilities
#function to create a requirement
@app.route("/createPublicRequirement",methods=['POST','GET'])
def createRequirements():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            data["public"] = "true"
            data["doctype"] = "requirement"
            res = es.search(index="accounts", body={"query":{"bool":{"must": [{"term" : {"_id" : data["ngoId"] }}]}}})
            #Adding NGO Name field as well in Requirement since we can fetch it directly from requirement and show donor the ngo name also.
            ngoName = "";
            for item in res["hits"]['hits']:
                ngoName = item['_source']["NGOName"]
            data["ngo"]=ngoName            
            res = es.index(index="donations", body=(data))
            
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't create requirement"),unpicklable=False)
        return jsonify({"status":"Success","requirementId":res["_id"]})

#function to get all requirements
@app.route("/getRequirements",methods=['POST','GET'])
def getRequirements():
    if request.method == "GET":
        try:
            res = es.search(index="donations", body={"query":{"bool":{"must": [{"term" : {"doctype" : "requirement" }},{"range" : {"quantity" : { "gte" : 0}}}]}}})
            print(res["hits"]['hits'][0]['_source']['details'])
            dataList = []
            for item in res["hits"]['hits']:
                dataList.append(itemRequirement(item['_source']['name'],item['_source']['category'],item['_source']['subcategory'],item['_source']['details'],item['_source']['quantity'],item['_source']['ngoId'],item['_source']['ngo']))
            for obj in dataList:
                print(obj.name)
            result = itemRequirementPackage(dataList,"success","object contains list of requirements")
        except Exception as e: 
            print(e)
            result = itemRequirementPackage("","failure","")
        result = jsonpickle.encode(result,unpicklable=False)
        return result


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
#function to get all items (For NGO)
@app.route("/getItems",methods=['POST','GET'])
def getItems():
    if request.method == "GET":
        try:
            res = es.search(index="donations", body={"query":{"bool":{"must": [{"term" : {"doctype" : "item" }}],"must_not": [{"term" : {"donatedFlag": "true" }}]}}})
            print(res["hits"]['hits'])
            dataList = []
            for item in res["hits"]['hits']:
                dataList.append(donationItem(item['_source']['itemname'],item['_source']['category'],item['_source']['subcategory'],item['_source']['details'],item['_source']['quantity'],item['_source']['quality']))
            for obj in dataList:
                print(obj.name)
            result = donationItemPackage(dataList,"success","object contains list of items up for donation")
        except Exception as e: 
            print(e)
            result = donationItemPackage("","failure","")
        result = jsonpickle.encode(result,unpicklable=False)
        return result

#function to donate an item 
@app.route("/donateItemPublic",methods=['POST'])
def donateItem():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            data["public"] = "true"
            res = es.index(index="donations", body=(data))
        except Exception as e: 
            print(e)
            return jsonpickle.encode(responsePackage("Failure","Could not create an item"))
        return res


   

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
        
        
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
    
    
    
 