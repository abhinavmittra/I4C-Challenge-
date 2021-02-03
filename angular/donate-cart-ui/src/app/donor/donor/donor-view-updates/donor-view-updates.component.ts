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

 baseUrlForImage = "http://127.0.0.1:5000/";
  donorUpdates:DonorUpdate[]=[];
  donorUpdatesChanged:Subscription;

  selectedItemUpdates:ItemUpdate[]=[];
  visibleItemUpdate:boolean[]=[]; //check which item's updates are being viewed
  
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
    //clear the updates array first
    this.selectedItemUpdates.length = 0;

    //set updates array to updates of item selected

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
      if( this.donorUpdates[index].itemUpdates[i]["date"]) 
        updateDate = this.donorUpdates[index].itemUpdates[i]["date"]
      console.log(this.donorUpdates[index].itemUpdates[i]["date"])
      this.selectedItemUpdates.push(new ItemUpdate(updateType,itemId,reqId,ngoId,donorId,ngoName,reqQuantity,reqDetails,msgFrom,msg,updateDate));
    
    }
    //set visible flag for this itemUpdates to true and all others to false
    for(var i =0;i<this.donorUpdates.length;i++){
      this.visibleItemUpdate[i]=false;
    }
    this.visibleItemUpdate[index]=true;
  }

  viewItemImage(index:number){
    window.open(this.baseUrlForImage+this.donorUpdates[index].itemImageLink)
  }
  respondToDonateReq(itemIndex:number,updateIndex:number,actionTaken:string){
    //send reqId,itemId,ngoId,donorId, actionTaken to backend
    console.log(actionTaken)
  }

  sendMessage(itemIndex:number,updateIndex:number){
    console.log("Item idx"+itemIndex);
    console.log("update Idx"+updateIndex);
    //get text from input field for message and send post req to server with reqId,donorId,itemId,ngoId
  }
  deleteItem(itemIndex:number){
    

    console.log("Item idx"+itemIndex);
    
    //call service to delete item and return a new copy.
    

    //send post req with id to delete
  }

  ngOnDestroy(){
    this.donorUpdatesChanged.unsubscribe();
  }

}
