import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DonorService } from 'src/app/donor/donor.service';
import {Subscription} from 'rxjs'
import { DonorUpdate } from 'src/app/model/donor-update';
import { ItemUpdate } from 'src/app/model/item-update';
@Component({
  selector: 'app-donor-view-updates',
  templateUrl: './donor-view-updates.component.html',
  styleUrls: ['./donor-view-updates.component.css']
})
export class DonorViewUpdatesComponent implements OnInit {

  constructor(private donorService:DonorService,private authService:AuthService) { }

 baseUrlForImage = "http://127.0.0.1:5000";
  donorUpdates:DonorUpdate[]=[];
  donorUpdatesChanged:Subscription;

  selectedItemUpdates:ItemUpdate[]=[];
  visibleItemUpdate:boolean[]=[]; //check which item's updates are being viewed
  messageBody:string="";
  itemIdx:number=null;
  updateIdx:number=null;
  msgMode:boolean = false;
  ngOnInit(): void {
    this.getDonorUpdates();   
  }

  getDonorUpdates(){
  this.donorUpdates=this.donorService.getDonorUpdates()

  //clear flag array first
  this.visibleItemUpdate.length  = 0;
    //set view flags for each item's updates to be false
    for(var i =0;i<this.donorUpdates.length;i++){
      this.visibleItemUpdate.push(false)
    }

  this.donorUpdatesChanged= this.donorService.donorUpdatesChanged.subscribe((data:DonorUpdate[])=>{
    this.donorUpdates=data; //get Donor Updates
    //clear flag array first
    this.visibleItemUpdate.length  = 0;
    //set view flags for each item's updates to be false
    for(var i =0;i<this.donorUpdates.length;i++){
      this.visibleItemUpdate.push(false)
    }
  });
  
   
  }
  viewItemUpdates(index:number){
  

    //set updates array to updates of item selected
    if(this.visibleItemUpdate[index]!=true){
        //clear the updates array first
    this.selectedItemUpdates.length = 0;

    for(var i  = 0;i<this.donorUpdates[index].itemUpdates.length;i++){
      //console.log(this.donorUpdates[index].itemUpdates[i]["updateType"])
      const updateType = this.donorUpdates[index].itemUpdates[i]["updateType"]
      const itemId = this.donorUpdates[index].itemUpdates[i]["itemId"]
      const reqId = this.donorUpdates[index].itemUpdates[i]["reqId"]
      const ngoId = this.donorUpdates[index].itemUpdates[i]["ngoId"]
      const donorId = this.donorUpdates[index].itemUpdates[i]["donorId"]
      

      //perform checks for optional fields
      var msg = "";
      var msgFrom = "";
      var ngoName = "";
      var reqQuantity = "";
      var reqDetails = ""
      var updateDate=""
      if(this.donorUpdates[index].itemUpdates[i]["message"])
        msg = this.donorUpdates[index].itemUpdates[i]["message"];
      if(this.donorUpdates[index].itemUpdates[i]["messageFrom"])
        msgFrom = this.donorUpdates[index].itemUpdates[i]["messageFrom"];
      if(this.donorUpdates[index].itemUpdates[i]["ngoName"])
        ngoName = this.donorUpdates[index].itemUpdates[i]["ngoName"];
      if(this.donorUpdates[index].itemUpdates[i]["reqQuantity"])
        reqQuantity = this.donorUpdates[index].itemUpdates[i]["reqQuantity"];
      if(this.donorUpdates[index].itemUpdates[i]["reqDetails"])
        reqDetails = this.donorUpdates[index].itemUpdates[i]["reqDetails"];
      if( this.donorUpdates[index].itemUpdates[i]["updateDate"]) 
        var tempDate = this.donorUpdates[index].itemUpdates[i]["updateDate"]
        var formattedDate = new Date(tempDate)
        updateDate = formattedDate.toLocaleString()

      this.selectedItemUpdates.push(new ItemUpdate(updateType,itemId,reqId,ngoId,donorId,ngoName,reqQuantity,reqDetails,msgFrom,msg,updateDate));
    
    }
    //set visible flag for this itemUpdates to true and all others to false
    for(var i =0;i<this.donorUpdates.length;i++){
      this.visibleItemUpdate[i]=false;
    }
    this.visibleItemUpdate[index]=true;

  }
  else{
    this.visibleItemUpdate[index]=!this.visibleItemUpdate[index];
  }
  }

  viewItemImage(index:number){
    
    window.open(this.baseUrlForImage+this.donorUpdates[index].itemImageLink)
  }
 

  sendMessage(){
  const message = this.messageBody
  var updates:DonorUpdate[];
    //get local copy of updates
        updates =  this.donorService.getDonorUpdates();
        var itemUpdates = {};
    itemUpdates = {
      "updateType":"message",
      "reqId":this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["reqId"],
      "itemId":this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["itemId"],
      "ngoId":this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["ngoId"],
      "ngoName":this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["ngoName"],
      "donorId":this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["donorId"],
      "message":message,
      "messageFrom":"donor",
      "updateDate":new Date().toISOString()
  }
  updates[this.itemIdx].itemUpdates.push(itemUpdates)

  this.donorService.setDonorUpdates(updates)



  //Call API
    this.donorService.sendMessageToNgo(this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["reqId"],
    this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["itemId"],
    this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["donorId"],
    this.donorUpdates[this.itemIdx].itemUpdates[this.updateIdx]["ngoId"],
    message).subscribe((data)=>{
      console.log(data)
    }
    )

    this.msgMode = false;
    
    
  }
  showUpdates(){
    this.msgMode = false;
  }
  setMsgIndex(itemIdx:number,updateIdx:number){
    this.itemIdx = itemIdx;
    this.updateIdx = updateIdx;
   this.msgMode = true;
    this.messageBody ="";
    
  }

  deleteItem(itemIndex:number){


  var actionPerformed = false;
  const itemId = this.donorUpdates[itemIndex].itemId;
  for(var i =0;i<this.donorUpdates[itemIndex].itemUpdates.length;i++){
    if(this.donorUpdates[itemIndex].itemUpdates[i]["updateType"]=="itemDeleted"&&itemId==this.donorUpdates[itemIndex].itemUpdates[i]["itemId"]){
      actionPerformed= true;
      alert("You have already deleted this item")
      
    }
  }



  if(!actionPerformed){

    var updates:DonorUpdate[];
    //get local copy of updates
        updates =  this.donorService.getDonorUpdates();
        var itemUpdates = {};
        
       itemUpdates = {
        "updateType":"itemDeleted",
        "itemId":updates[itemIndex].itemId,
        "updateDate":new Date().toISOString()
    }
  
      updates[itemIndex].itemUpdates.push(itemUpdates)
      


      
      //Remove any noupdate type objects because now we have a deleteItem type update
      for(var i =0;i<updates[itemIndex].itemUpdates.length;i++){
        if(updates[itemIndex].itemUpdates[i]["updateType"]=="noupdate"){
          updates[itemIndex].itemUpdates.splice(i,1)
          
        }
      }
      

      this.donorService.setDonorUpdates(updates);


      //call API
    this.donorService.deleteItem(    
    this.donorUpdates[itemIndex].itemId,
    this.authService.getUserId()
    ).subscribe((data)=>{
     console.log(data)
    });
  }
}

acceptOrReject(itemIndex:number,updateIdx:number,actionTaken:string){

  var actionPerformed = false;
  const reqId = this.donorUpdates[itemIndex].itemUpdates[updateIdx]["requirementId"];
  for(var i =0;i<this.donorUpdates[itemIndex].itemUpdates.length;i++){
    if((this.donorUpdates[itemIndex].itemUpdates[i]["updateType"]=="accept"||this.donorUpdates[itemIndex].itemUpdates[i]["updateType"]=="decline")&&reqId==this.donorUpdates[itemIndex].itemUpdates[i]["requirementId"]){
      actionPerformed= true;
      alert("You have already accepted or declined this requirement")
      
    }
  }


  if(!actionPerformed){
    var updates:DonorUpdate[];
        updates =  this.donorService.getDonorUpdates();
        var itemUpdates = {};
        if(actionTaken=="accept"){
       itemUpdates = {
        "updateType":"accept",
        "reqId":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["reqId"],
        "itemId":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["itemId"],
        "ngoId":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["ngoId"],
        "ngoName":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["ngoName"],
        "donorId":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["donorId"],
        "updateDate":new Date().toISOString()
    }
  }
    else if(actionTaken=="decline"){
       itemUpdates = {
        "updateType":"decline",
        "reqId":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["reqId"],
        "itemId":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["itemId"],
        "ngoId":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["ngoId"],
        "ngoName":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["ngoName"],
        "donorId":this.donorUpdates[itemIndex].itemUpdates[updateIdx]["donorId"],
        "updateDate":new Date().toISOString()
    }
    }
      updates[itemIndex].itemUpdates.push(itemUpdates)
      console.log(updates)
      this.donorService.setDonorUpdates(updates);



  this.donorService.acceptOrReject(
    this.donorUpdates[itemIndex].itemUpdates[updateIdx]["reqId"],
  this.donorUpdates[itemIndex].itemUpdates[updateIdx]["itemId"],
  this.donorUpdates[itemIndex].itemUpdates[updateIdx]["donorId"],
  this.donorUpdates[itemIndex].itemUpdates[updateIdx]["ngoId"],
  this.donorUpdates[itemIndex].itemUpdates[updateIdx]["ngoName"],
  actionTaken).subscribe((data)=>{
   console.log(data)
  });
}
}

  ngOnDestroy(){
    this.donorUpdatesChanged.unsubscribe();
  }

}
