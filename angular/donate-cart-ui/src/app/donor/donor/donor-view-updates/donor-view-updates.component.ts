import { Component, OnInit } from '@angular/core';
import {DonorViewUpdateItem} from '../../../model/donor-view-update-item';
import {RequestItem} from '../../../model/request-item';
@Component({
  selector: 'app-donor-view-updates',
  templateUrl: './donor-view-updates.component.html',
  styleUrls: ['./donor-view-updates.component.css']
})
export class DonorViewUpdatesComponent implements OnInit {

  constructor() { }

  itemListMode:boolean=null;
  loadingFlag:boolean = null;
  donorItemsList : DonorViewUpdateItem[] = [];
  selectedDonationRequestList :RequestItem[]=[];
  selectedItem:DonorViewUpdateItem = null;
  ngOnInit(): void {
    
    this.loadingFlag = false; //change to true when api implementation is done.
    this.itemListMode = true;
    //send post req to get all donation items given by this donor
    this.donorItemsList.push(new DonorViewUpdateItem("1","Tintin Comics","Educational","Books","I have 50 comics to be donated","50","Excellent","Available"));
    this.donorItemsList.push(new DonorViewUpdateItem("2","Canvas Shoes","Clothes","Shoes","I have 5 pair of shoes that might meet your requirement","5","Moderate","Waiting NGO Approval"));
  }

  viewItemDetails(index:number){
    this.itemListMode = false;
    this.selectedItem = this.donorItemsList[index];
    if(this.selectedItem.status =="Available"){
      //send post req to server to fetch all the donate update types for this reqId
      this.selectedDonationRequestList.length=0;
      this.selectedDonationRequestList.push(new RequestItem("1","30","I have a bookstore so I can offer you 30 books"));
      this.selectedDonationRequestList.push(new RequestItem("2","10","I have an electronics shop so I can offer you 10 low budget laptops"));
    }
  }

  viewList(index){
    this.itemListMode = true;
  }

  viewImage(){
    
  }
  approveRequest(index:number){

  }
  rejectRequest(index:number){
    
  }

  deleteItem(){
    const id = this.selectedItem.itemId;

    console.log("deleted id"+id);
    //call service to delete item and return a new copy.
    this.itemListMode = true;

    //send post req with id to delete
  }


}
