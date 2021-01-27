from flask import Flask, request, url_for
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
     def __init__(self,name,category,subcategory,details,quantity,ngoId):
        self.name = name
        self.category = category
        self.subcategory = subcategory
        self.details = details
        self.quantity = quantity
        self.ngoId = ngoId

class donationItemPackage:
    def __init__(self,donationItem,status,message):
        self.donationItem = donateItem
        self.status = status
        self.message = message

class itemRequirementPackage:
    def __init__(self,itemRequirement,status,message):
        self.itemRequirement = itemRequirement
        self.status = status
        self.message = message



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
            print("Error in create user account function")
            result = {"status" : "failure"}
            result = json.dumps(result)
            return result
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
            print("Error in create NGO function")
            result = {"status" : "failure"}
            result = json.dumps(result)
            return result
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
            return "Error in getPassword function"
        return str(result)

#function to get all unverififed NGOs
@app.route("/getUnverifiedNgoList",methods=['POST','GET'])
def getNgoList():
    if request.method == "GET":
        try:
            res = es.search(index="accounts", body={"query":{"bool":{"must":{"term" : {"UserType" : "NGO"  }},"must_not":{"term" : { "VerifiedNGOFlag" : "true" }}}}})
        except Exception as e: 
            print(e)
            return "Error in getNgoList function"
        return res

#function to approve or reject an NGO by admin
@app.route("/approve_reject_NGO",methods=['POST'])
def approveRejectNGO():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            actionToken = data["actionToken"]
            ngoId = data ["id"]
            print (actionToken)
            if actionToken == 'accept':
                res = es.update(index = "accounts", id = ngoId, body = {"doc": {"VerifiedNGOFlag": "true"}})
            elif actionToken == 'reject':
                res = es.delete(index = "accounts", id = ngoId)
        except Exception as e:
            print (e)
            return "Error in approve-reject NGO function"
        return res

#function to create a requirement
@app.route("/createPublicRequirement",methods=['POST'])
def createRequirements():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            data["public"] = "true"
            res = es.index(index="donations", body=(data))
        except Exception as e: 
            print(e)
            return "Error in create Requirements function"
        return res

#function to get all requirements
@app.route("/getRequirements",methods=['POST','GET'])
def getRequirements():
    if request.method == "GET":
        try:
            res = es.search(index="donations", body={"query":{"bool":{"must": [{"term" : {"doctype" : "requirement" }},{"range" : {"quantity" : { "gte" : 0}}}]}}})
            print(res["hits"]['hits'][0]['_source']['details'])
            dataList = []
            for item in res["hits"]['hits']:
                dataList.append(itemRequirement(item['_source']['itemname'],item['_source']['category'],item['_source']['subcategory'],item['_source']['details'],item['_source']['quantity'],item['_source']['NGOID']))
            for obj in dataList:
                print(obj.name)
            result = itemRequirementPackage(dataList,"success","object contains list of requirements")
        except Exception as e: 
            print(e)
            result = itemRequirementPackage("","failure","")
        result = jsonpickle.encode(result,unpicklable=False)
        return result

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
            return "Error in donate item function"
        return res

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)