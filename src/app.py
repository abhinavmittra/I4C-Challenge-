from flask import Flask, request, url_for
from flask_cors import CORS
from ssl import create_default_context
from elasticsearch import Elasticsearch
import json
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




#function to get all accounts (NGO & Donor accounts)
@app.route("/get_accounts",methods=['POST','GET'])
def getAccounts():
    if request.method == "GET":
        try:
            res = es.search(index="accounts", body={"query": {"match_all": {}}})
        except Exception as e: 
            print(e)
            return "Error in getAccounts function"
        return res

#function to get donation details
@app.route("/get_donations",methods=['POST','GET'])
def getDonation():
    if request.method == "GET":
        try:
            res = es.search(index="donations", body={"query": {"match_all": {}}})
        except Exception as e: 
            print(e)
            return "Error in getDonation function"
        return res

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
                return "Email id already exists"
            else: 
                res = es.index(index = "accounts", body = data)
        except Exception as e: 
            print(e)
            return "Error in create User function"
        return res

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
                return "Email id already exists"
            else :
                res = es.index(index = "accounts", body = data)
                print("test")
        except Exception as e: 
            print(e)
            return "Error in create NGO function"
        return res


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
@app.route("/getNgoList",methods=['POST','GET'])
def getNgoList():
    if request.method == "GET":
        try:
            res = es.search(index="accounts", body={"query":{"bool":{"must":{"term" : {"UserType" : "NGO"  }},"must_not":{"term" : { "VerifiedNGOFlag" : "true" }}}}})
        except Exception as e: 
            print(e)
            return "Error in getNgoList function"
        return res

#function to mark NGO as verified
@app.route("/approveNGO",methods=['POST','GET'])
def approveNGO():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            ngoId = data["id"]
            print (ngoId)
            res = es.update(index = "accounts", id = ngoId, body = {"doc": {"VerifiedNGOFlag": "true"}})
        except Exception as e:
            print (e)
            return "Error in approve NGO function"
        return res

#function to reject(delete) an NGO 
@app.route("/rejectNGO",methods=['POST','GET'])
def rejectNGO():
    if request.method == "POST":
        try:
            data = json.loads(request.data)
            ngoId = data["id"]
            print (ngoId)
            res = es.delete(index = "accounts", id = ngoId)
        except Exception as e:
            print (e)
            return "Error in Reject NGO function"
        return res

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)