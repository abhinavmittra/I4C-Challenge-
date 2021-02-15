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

class image:
    def __init__(self,userId,date,imageName,image):
        self.userId = userId
        self.date = date
        self.imageName = imageName
        self.image = image

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

def xxx(request,es):
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




