# from flask import Flask, request, url_for , redirect , send_from_directory
from ssl import create_default_context
import datetime
from datetime import timedelta
import json
import jsonpickle
import datetime
from datetime import timedelta
from werkzeug.utils import secure_filename
import os
from os import listdir
from os.path import isfile, join
from base64 import b64encode
import base64

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
