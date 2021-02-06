import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

import { DoneeService } from '../donee.service';
import {Subscription} from 'rxjs'
import { DoneeUpdate } from 'src/app/model/donee-update';
import {RequirementUpdate} from '../../model/requirement-update';
@Component({
  selector: 'app-donee-view-updates',
  templateUrl: './donee-view-updates.component.html',
  styleUrls: ['./donee-view-updates.component.css']
})
export class DoneeViewUpdatesComponent implements OnInit {

  constructor(private authService:AuthService,private doneeService:DoneeService) { }
  
 baseUrlForImage = "http://127.0.0.1:5000/";
 doneeUpdates:DoneeUpdate[]=[];
 doneeUpdatesChanged:Subscription;
  
 selectedReqUpdates:RequirementUpdate[]=[];
 visibleReqUpdate:boolean[]=[]; //check which item's updates are being viewed
  msgMode :boolean = false;
 reqIdx:number = null;
 updateIdx:number = null;
 messageBody:string = "";
  loadingFlag:boolean = null;
  

  ngOnInit(): void {
    this.getDoneeUpdates()
  
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
      this.doneeUpdates=data; //get Donor Updates
      //clear flag array first
      this.visibleReqUpdate.length  = 0;
      //set view flags for each item's updates to be false
      for(var i =0;i<this.doneeUpdates.length;i++){
        this.visibleReqUpdate.push(false)
      }
    });
    
     
    }

  

    viewReqUpdates(index:number){




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
        if( this.doneeUpdates[index].reqUpdates[i]["date"]) 
          updateDate = this.doneeUpdates[index].reqUpdates[i]["date"]
        if( this.doneeUpdates[index].reqUpdates[i]["itemImageLink"]) 
          itemImageLink = this.doneeUpdates[index].reqUpdates[i]["itemImageLink"]
         if( this.doneeUpdates[index].reqUpdates[i]["itemQuality"]) 
          itemQuality = this.doneeUpdates[index].reqUpdates[i]["itemQuality"]
          if( this.doneeUpdates[index].reqUpdates[i]["pincode"]) 
          pincode = this.doneeUpdates[index].reqUpdates[i]["pincode"]

        this.selectedReqUpdates.push(new RequirementUpdate(updateType,itemId,reqId,ngoId,donorId,pincode,ngoName,itemQuantity,itemQuality,itemImageLink,itemDetails,msgFrom,msg,updateDate));
      
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
  
    viewItemImage(reqIdx:number,updateIdx:number){
      window.open(this.baseUrlForImage + this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["itemImageLink"])
    }
    
  
    sendMessage(){
    
      const message = this.messageBody
      this.doneeService.sendMessageToDonor(this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["reqId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["itemId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["donorId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["ngoId"],
      message).subscribe((data)=>{
        console.log(data)
      }
      )

      this.msgMode = false;
      
      
    }
    showUpdates(){
      this.msgMode = false;
    }
    setMsgIndex(reqIdx:number,updateIdx:number){
      this.reqIdx = reqIdx;
      this.updateIdx = updateIdx;
     this.msgMode = true;
      this.messageBody ="";
      console.log(this.reqIdx,this.updateIdx);
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

      this.doneeService.markReceived(this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["reqId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["itemId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["donorId"],
      this.doneeUpdates[reqIdx].reqUpdates[updateIdx]["ngoId"]).subscribe((data)=>{
       console.log(data)
      })
    }
    }

    deleteReq(reqIndex:number){

        this.doneeService.deleteRequirement(this.doneeUpdates[reqIndex].reqId,
          this.authService.getUserId()).subscribe((data)=>{
         console.log(data)
        });
  
    }

    acceptOrReject(reqIndex:number,updateIdx:number,actionTaken:string){
      //validate first if it has been accepted or rejected
      var actionPerformed = false;
      const itemId = this.doneeUpdates[reqIndex].reqUpdates[updateIdx]["itemId"];
      for(var i =0;i<this.doneeUpdates[reqIndex].reqUpdates.length;i++){
        if((this.doneeUpdates[reqIndex].reqUpdates[i]["updateType"]=="acceptDonation"||this.doneeUpdates[reqIndex].reqUpdates[i]["updateType"]=="declineDonation")&&itemId==this.doneeUpdates[reqIndex].reqUpdates[i]["itemId"]){
          actionPerformed= true;
          alert("You have already accepted or declined this item")
          
        }
      }


      if(!actionPerformed){

      this.doneeService.acceptOrReject(
        this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["reqId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["itemId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["donorId"],
      this.doneeUpdates[this.reqIdx].reqUpdates[this.updateIdx]["ngoId"],
      actionTaken).subscribe((data)=>{
       console.log(data)
      });
    }
  }
  
}
