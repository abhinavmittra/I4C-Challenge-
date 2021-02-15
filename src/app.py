from flask import Flask, request, url_for , redirect , send_from_directory
from flask_cors import CORS
from ssl import create_default_context
from elasticsearch import Elasticsearch
import json
import jsonpickle
import datetime
from datetime import timedelta
from werkzeug.utils import secure_filename
import os
from os import listdir
from os.path import isfile, join
from donor import userAccountCreation,donateItem,getRequirements, respondToRequirement ,respondToDonationRequest, deleteItem, getUpdatesForDonor, sendMessageToNgo
from ngo import getNgoInfo,createNgoAccount,getNgoListUnverified,requestItem,getItems,createRequirement, acceptDeclineDonation, deleteRequirement, getUpdatesForNGO, markItem, sendMessageToDonor
from admin import authenticate,approveRejectNGO
import base64
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

#-----------Connecting to Cluster----------------
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

#AUTH Utilities
#function for user/ngo authentication
@app.route("/authenticate",methods=['POST'])
def authentication():
    result = authenticate(request,es)
    return result


##ADMIN Utilities
#function to get all unverififed NGOs
@app.route("/getUnverifiedNgoList",methods=['POST','GET'])
def getUnverifiedNgoList():
    result = getNgoListUnverified(request,es)
    return result

#function to approve or reject an NGO by admin (to mark NGO as verified)
@app.route("/approve_reject_NGO",methods=['POST'])
def approveRejectNGOAdmin():
    result = approveRejectNGO(request,es)
    return result


##NGO Utilities-------------------------------------------------------------------------------------------------------------------------------------------------
#function to create an NGO account
@app.route("/createNgoAccount",methods=['POST'])
def ngoAccountCreation():
    result = createNgoAccount(request,es)
    return result

#function to get Ngo Details 
@app.route("/getNgoInfo",methods=['GET']) 
def NgoInfo():
    result = getNgoInfo(request,es)
    return result

#function to request an item
@app.route("/requestItem",methods=['POST'])
def requestItemNgo():
    result = requestItem(request,es)
    return result        
    
#function to get all items (For NGO)
@app.route("/getItems",methods=['POST','GET'])
def getItemsNgo():
    result = getItems(request,es)
    return result
    
#function to create a requirement
@app.route("/createPublicRequirement",methods=['POST','GET'])
def createRequirementNgo():
    result = createRequirement(request,es)
    return result

#function to delete requirement
@app.route("/deleteRequirement",methods=['POST'])    
def deleteRequirementNgo():
    result = deleteRequirement(request,es)
    return result

@app.route("/getUpdatesForNGO",methods=['POST'])    
def getUpdatesNgo():
    result = getUpdatesForNGO(request,es)
    return result

#Function to mark an item as received
@app.route("/markItem",methods=['POST'])
def markItemReceived():
   result = markItem(request,es)
   return result

#function to send message TO-Donor from NGO
@app.route("/sendMessageToDonor",methods=['POST'])    
def sendMessageToDonorFromNgo():
    result = sendMessageToDonor(request,es)
    return result


##DONOR Utilities---------------------------------------------------------------------------------------------------------------------------------------------------------
#function to create a Donor account
@app.route("/createUserAccount",methods=['POST','GET'])
def createUserAccount():
    result = userAccountCreation(request,es)
    return result


#function to donate an item 
@app.route("/donateItemPublic",methods=['POST'])
def donateItemDonor():
    result = donateItem(request,es)
    return result

#function to respond to a requirement
@app.route("/respondToRequirement",methods=['POST'])
def respondToRequirementDonor():
    result = respondToRequirement(request,es)
    return result

@app.route("/respondToDonationRequest",methods=['POST'])    
def respondToDonationRequestDonor():
    result = respondToDonationRequest(request,es)
    return result

#function for an NGO to accept or decline a donation request 
@app.route('/accept_decline_donation',methods=['POST'])
def acceptDeclineDonationNgo():
    result = acceptDeclineDonation(request,es)
    return result

#function to delete item
@app.route("/deleteItem",methods=['POST'])    
def deleteItemDonor():
    result = deleteItem(request,es)
    return result

@app.route("/getUpdatesForDonor",methods=['POST'])    
def getUpdatesDonor():
    result = getUpdatesForDonor(request,es)
    return result

#function to send a message TO-ngo FROM-Donor
@app.route("/sendMessageToNgo",methods=['POST'])    
def sendMessageToNgoFromDonor():
    result = sendMessageToNgo(request,es)
    return result

#function to test if image gets converted to base64
@app.route("/imageConvert",methods=['POST'])    
def imagConvertTest():
    if request.method == "POST":
        try:
                f = request.files['image']
                filename = f.filename
                #saving image as it needs to be opened while encoding
                f.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
                imagepath = './Upload_folder/' + filename
                with open(imagepath, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read())
                #deleting the saved image
                if os.path.exists(imagepath):
                    os.remove(imagepath)
        except Exception as e:
                print(e,"error in image converion")
                return jsonpickle.encode("Failure","Error in image upload")
        return(encoded_string)
   
#Other functions ----------------------------------------------------------------
#function that returns the image when the url is hit
@app.route('/uploads/<filename>',methods = ["GET"])
def uploaded_file(filename):
    if request.method == "GET":
        print("in uploads")
        print(filename)
        url = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'])
        return send_from_directory(url,
                                filename)

#fn to test code
@app.route("/test",methods=['POST'])
def test():
    if request.method =='POST':
        #itemId = json.loads(request.data)["itemId"]
        #res = es.get(index="donations", id=itemId)
        ID=json.loads(request.data)["ID"]
        res = es.update(index="donations",id = ID, body = {"doc": {"imageLink":json.loads(request.data)["imageLink"]}})
        return res

#changing function name as this deletes the entire requirement document
#Need to think about handling side effects too i.e how to handle updates for the requests made to these delete items/requirements    
@app.route("/deleteRequirementDocument",methods=['POST','GET'])    
def deleteRequirementDocument():
    if request.method=="POST":
        try:
            data = json.loads(request.data)
            reqId = data["requirementId"]
            res = es.delete(index = "donations", id = reqId)
            # print(res)
        except Exception as e:
            print(e)
            return jsonpickle.encode(responsePackage("Error","Couldn't delete requirement"),unpicklable=False)
        return jsonpickle.encode(responsePackage("Success","Deleted Requirement Successfully"),unpicklable=False)

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
        
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
    
    
    
 