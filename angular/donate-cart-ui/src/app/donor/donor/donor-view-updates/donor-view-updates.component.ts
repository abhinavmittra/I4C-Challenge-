import { Component, OnInit } from '@angular/core';
import {DonorViewUpdateItem} from '../../../model/donor-view-update-item';
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
  }

  viewList(index){
    this.itemListMode = true;
  }

  viewImage(){
    
  }


}
