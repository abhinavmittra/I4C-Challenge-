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
        
      this.selectedItemUpdates.push(new ItemUpdate(updateType,itemId,reqId,ngoId,donorId,ngoName,reqQuantity,reqDetails,msgFrom,msg));
    
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
  approveRequest(index:number){

  }
  rejectRequest(index:number){
    
  }

 /* deleteItem(){
    const id = this.selectedItem.itemId;

    console.log("deleted id"+id);
    //call service to delete item and return a new copy.
    this.itemListMode = true;

    //send post req with id to delete
  }*/

  ngOnDestroy(){
    this.donorUpdatesChanged.unsubscribe();
  }

}
