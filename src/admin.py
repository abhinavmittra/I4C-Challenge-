from ssl import create_default_context
import json
import jsonpickle
import datetime
from datetime import timedelta
from werkzeug.utils import secure_filename
import os
from os import listdir
from os.path import isfile, join

class responsePackage:
    def __init__(self,status,message):
        self.status = status
        self.message = message

def authenticate(request,es):
    # es_updated = Elasticsearch(
    #            ['https://5ea0807d2db24793b2ae5f6ee4f413bd.ap-south-1.aws.elastic-cloud.com:9243'],
    #            http_auth=("elastic","JEjJFXwITPboNUxEIcnxwsYs"),
    #             scheme = "https",
    #             )
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
                            "pass":True,
                            "name":"Admin"
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

def approveRejectNGO(request,es):
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