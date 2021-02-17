import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

import { DoneeService } from '../donee.service';
import {Subscription} from 'rxjs'
import { DoneeUpdate } from 'src/app/model/donee-update';
import {RequirementUpdate} from '../../model/requirement-update';
import { UtilityService } from 'src/app/shared/utility.service';
@Component({
  selector: 'app-donee-view-updates',
  templateUrl: './donee-view-updates.component.html',
  styleUrls: ['./donee-view-updates.component.css']
})
export class DoneeViewUpdatesComponent implements OnInit {

  constructor(private authService:AuthService,private doneeService:DoneeService,private utilityService:UtilityService) { }
  
 
 doneeUpdates:DoneeUpdate[]=[];
 doneeUpdatesChanged:Subscription;
  
 selectedReqUpdates:RequirementUpdate[]=[];
 visibleReqUpdate:boolean[]=[]; //check which item's updates are being viewed
  msgMode :boolean = false;
  imgMode:boolean=false;
  imageLoaded:boolean=false;
  imageString:string=""
  selectedImage:File=null;
 reqIdx:number = null;
 updateIdx:number = null;
 messageBody:string = "";
  loadingFlag:boolean = null;
  

  ngOnInit(): void {
    this.getDoneeUpdates()
    
  
  }
  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
  }
  getDoneeUpdates(){
    this.doneeUpdates=this.doneeService.getDoneeUpdates()
  
    //clear flag array first
    this.visibleReqUpdate.length  = 0;
      //set view flags for each item's updates to be false
      for(var i =0;i<this.doneeUpdates.length;i++){
        this.visibleReqUpdate.push(false)
      }
  
    this.doneeUpdatesChanged= this.doneeService.doneeUpdatesChanged.subscribe((data:DoneeUpdate[])=>{
      this.doneeUpdates=data; //get Donee Updates
      //clear flag array first
      this.visibleReqUpdate.length  = 0;
      //set view flags for each item's updates to be false
      for(var i =0;i<this.doneeUpdates.length;i++){
        this.visibleReqUpdate.push(false)
      }
    });
    
     
    }

  

    viewReqUpdates(index:number){
      console.log(this.visibleReqUpdate[index])
      console.log(this.doneeUpdates[index])
      if(this.visibleReqUpdate[index]!=true){
      //clear the updates array first
      this.selectedReqUpdates.length = 0;
  
      //set updates array to updates of item selected
  
      for(var i  = 0;i<this.doneeUpdates[index].reqUpdates.length;i++){
        //console.log(this.donorUpdates[index].itemUpdates[i]["updateType"])
        const updateType = this.doneeUpdates[index].reqUpdates[i]["updateType"]
        const itemId = this.doneeUpdates[index].reqUpdates[i]["itemId"]
        const reqId = this.doneeUpdates[index].reqUpdates[i]["reqId"]
        const ngoId = this.doneeUpdates[index].reqUpdates[i]["ngoId"]
        const donorId = this.doneeUpdates[index].reqUpdates[i]["donorId"]
        
  
        //perform checks for optional fields
        var msg = "";
        var msgFrom = "";
        var ngoName = "";
        var itemQuality = ""
        var itemQuantity = "";
        var itemDetails = ""
        var itemImageLink = ""        
        var updateDate=""
        var pincode = ""
        if(this.doneeUpdates[index].reqUpdates[i]["message"])
          msg = this.doneeUpdates[index].reqUpdates[i]["message"];
        if(this.doneeUpdates[index].reqUpdates[i]["messageFrom"])
          msgFrom = this.doneeUpdates[index].reqUpdates[i]["messageFrom"];
        if(this.doneeUpdates[index].reqUpdates[i]["ngoName"])
          ngoName = this.doneeUpdates[index].reqUpdates[i]["ngoName"];
        if(this.doneeUpdates[index].reqUpdates[i]["itemQuantity"])
          itemQuantity = this.doneeUpdates[index].reqUpdates[i]["itemQuantity"];
        if(this.doneeUpdates[index].reqUpdates[i]["itemDetails"])
          itemDetails = this.doneeUpdates[index].reqUpdates[i]["itemDetails"];
        if( this.doneeUpdates[index].reqUpdates[i]["updateDate"]) 
          updateDate = this.doneeUpdates[index].reqUpdates[i]["updateDate"]
        if( this.doneeUpdates[index].reqUpdates[i]["itemImageLink"]) 
          itemImageLink = this.doneeUpdates[index].reqUpdates[i]["itemImageLink"]
         if( this.doneeUpdates[index].reqUpdates[i]["itemQuality"]) 
          itemQuality = this.doneeUpdates[index].reqUpdates[i]["itemQuality"]
          if( this.doneeUpdates[index].reqUpdates[i]["pincode"]) 
          pincode = this.doneeUpdates[index].reqUpdates[i]["pincode"]
       // console.log("about to set updates")
        this.selectedReqUpdates.push(new RequirementUpdate(updateType,itemId,reqId,ngoId,donorId,pincode,ngoName,itemQuantity,itemQuality,itemImageLink,itemDetails,msgFrom,msg,updateDate));
        console.log(this.selectedReqUpdates);
      }
      //set visible flag for this itemUpdates to true and all others to false
      for(var i =0;i<this.doneeUpdates.length;i++){
        this.visibleReqUpdate[i]=false;
      }
      this.visibleReqUpdate[index]=true;
    }
    else{
      this.visibleReqUpdate[index]=!this.visibleReqUpdate[index];
    }
  }
  
  
    
  
    sendMessage(){
    
      const message = this.messageBody

      
      

      var submitForm = new FormData()
      submitForm.append("requirementId",this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["reqId"])
      submitForm.append("itemId",this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["itemId"])
      submitForm.append("message",message)
      submitForm.append("donorId",this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["donorId"],)
      submitForm.append("ngoId",this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["ngoId"])
      if(this.selectedImage!=null)
      submitForm.append("image",this.selectedImage)





      //Call API
      this.doneeService.sendMessageToDonor(submitForm).subscribe((data)=>{
        var updates:DoneeUpdate[];
        //get local copy of updates
        updates =  this.doneeService.getDoneeUpdates();
        var reqUpdates = {};
        reqUpdates = {
          "updateType":"message",
          "reqId":this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["reqId"],
          "itemId":this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["itemId"],
          "ngoId":this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["ngoId"],
          "ngoName":this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["ngoName"],
          "donorId":this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["donorId"],
          "message":message,
          "messageFrom":"NGO",
          "updateDate":new Date().toISOString(),
          "imageLink":data["imageId"]
      }
      updates[this.reqIdx].reqUpdates.push(reqUpdates)
    //update local copy
      this.doneeService.setDoneeUpdates(updates)
      this.msgMode = false;
      }
      )

      
      
      
    }
    showUpdates(){
      this.msgMode = false;
      this.imgMode = false;
      this.imageLoaded = false;
    }
    setMsgIndex(reqIdx:number,updateIdx:number){
      this.reqIdx = reqIdx;
      this.updateIdx = updateIdx;
     this.msgMode = true;
      this.messageBody ="";
     
    }

    markReceived(reqIdx:number,updateIdx:number){
      //check if received update already exists for itemId, if not then mark received otherwise 
      
      var receivedFlag = false;
      const itemId = this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["itemId"];
      for(var i =0;i<this.doneeUpdates[reqIdx].reqUpdates.length;i++){
        if(this.doneeUpdates[reqIdx].reqUpdates[i]["updateType"]=="received"&&itemId==this.doneeUpdates[reqIdx].reqUpdates[i]["itemId"]){
          receivedFlag = true;
          alert("Already received")
          console.log("This item has already been received")
        }
      }
    


      if(!receivedFlag){

        var updates:DoneeUpdate[];
        //get local copy of updates
        updates =  this.doneeService.getDoneeUpdates();
        var reqUpdates = {};
        reqUpdates = {
          "updateType":"received",
          "reqId":this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["reqId"],
          "itemId":this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["itemId"],
          "ngoId":this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["ngoId"],
          "donorId":this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["donorId"],
          "updateDate":new Date().toISOString()
      }
      updates[reqIdx].reqUpdates.push(reqUpdates)
    //update local copy
      this.doneeService.setDoneeUpdates(updates)





      //Call API
      this.doneeService.markReceived(this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["reqId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["itemId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["donorId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["ngoId"]).subscribe((data)=>{
       console.log(data)
      })
    }
    }

    viewImage(reqIndex:number,updateIndex:number,serviceType:string){
      this.imageString="";
    this.imgMode=true;
    //replace hardcoded value with this.doneeUpdates[reqIndex].reqUpdates[updateIndex]["imageLink"]


    if(serviceType=='message'){
    this.utilityService.getImageFromServer("ESk9qncBnssMJ-PIcb6J").subscribe((data)=>{
      if(data["image"]!="-1"){
      this.imageString = "data:image/jpeg;base64,"+data["image"]
      this.imageLoaded=true;
      }
      else{
        this.imageString=="-1";
        this.imageLoaded=false;
      }
    })
    }
  
  else if(serviceType=='item'){
   //replace hardcoded by this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["itemImageLink"]
    this.utilityService.getImageFromServer("ESk9qncBnssMJ-PIcb6J").subscribe((data)=>{
      if(data["image"]!="-1"){
      this.imageString = "data:image/jpeg;base64,"+data["image"]
      this.imageLoaded=true;
      }
      else{
        this.imageString=="-1";
        this.imageLoaded=false;
      }
    })
  }
}

    deleteReq(reqIndex:number){
      var actionPerformed = false;
    const reqId = this.doneeUpdates[reqIndex].reqId;
    for(var i =0;i<this.doneeUpdates[reqIndex].reqUpdates.length;i++){
      if(this.doneeUpdates[reqIndex].reqUpdates[i]["updateType"]=="requirementDeleted"&&reqId==this.doneeUpdates[reqIndex].reqUpdates[i]["reqId"]){
      actionPerformed= true;
      alert("You have already deleted this requirement")
      
      }
   }



   if(!actionPerformed){


    var updates:DoneeUpdate[];
    //get local copy of updates
        updates =  this.doneeService.getDoneeUpdates();
        var itemUpdates = {};
        
       itemUpdates = {
        "updateType":"requirementDeleted",
        "reqId":updates[reqIndex].reqId,
        "updateDate":new Date().toISOString()
    }
  
      updates[reqIndex].reqUpdates.push(itemUpdates)
      


      
      //Remove any noupdate type objects because now we have a deleteItem type update
      for(var i =0;i<updates[reqIndex].reqUpdates.length;i++){
        if(updates[reqIndex].reqUpdates[i]["updateType"]=="noupdate"){
          updates[reqIndex].reqUpdates.splice(i,1)
          
        }
      }
      
      console.log(updates)
      this.doneeService.setDoneeUpdates(updates);



    //Call API
   this.doneeService.deleteRequirement(this.doneeUpdates[reqIndex].reqId,
          this.authService.getUserId()).subscribe((data)=>{
         console.log(data)
        });
   }



     
  
    }

    acceptOrReject(reqIndex:number,updateIdx:number,actionTaken:string){
      //validate first if it has been accepted or rejected'
      
      var actionPerformed = false;
      const itemId = this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["itemId"];
      for(var i =0;i<this.doneeUpdates[reqIndex].reqUpdates.length;i++){
        if((this.doneeUpdates[reqIndex].reqUpdates[i]["updateType"]=="acceptDonation"||this.doneeUpdates[reqIndex].reqUpdates[i]["updateType"]=="declineDonation")&&itemId==this.doneeUpdates[reqIndex].reqUpdates[i]["itemId"]){
          actionPerformed= true;
          alert("You have already accepted or declined this item")
          
        }
      }


      if(!actionPerformed){
        //Add Updates to local copy
        var updates:DoneeUpdate[];
        updates =  this.doneeService.getDoneeUpdates();
        var reqUpdates = {};
        if(actionTaken=="accept"){
       reqUpdates = {
        "updateType":"acceptDonation",
        "reqId":this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["reqId"],
        "itemId":this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["itemId"],
        "ngoId":this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["ngoId"],
        "donorId":this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["donorId"],
        "updateDate":new Date().toISOString()
    }
  }
    else if(actionTaken=="decline"){
       reqUpdates = {
        "updateType":"declineDonation",
        "reqId":this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["reqId"],
        "itemId":this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["itemId"],
        "ngoId":this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["ngoId"],
        "donorId":this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["donorId"],
        "updateDate":new Date().toISOString()
    }
    }
      updates[reqIndex].reqUpdates.push(reqUpdates)
      console.log(updates)
      this.doneeService.setDoneeUpdates(updates);

      this.doneeService.acceptOrReject(
        this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["reqId"],
      this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["itemId"],
      this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["donorId"],
      this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["ngoId"],
      actionTaken).subscribe((data)=>{
       console.log(data)
      });
    }
  }
  
}
