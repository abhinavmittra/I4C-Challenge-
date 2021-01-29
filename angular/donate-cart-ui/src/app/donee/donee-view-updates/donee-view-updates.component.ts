import { Component, OnInit } from '@angular/core';
import {DoneeViewUpdateItem} from '../../model/donee-view-update-item';
import {DonateRequirement} from '../../model/donate-requirement';
@Component({
  selector: 'app-donee-view-updates',
  templateUrl: './donee-view-updates.component.html',
  styleUrls: ['./donee-view-updates.component.css']
})
export class DoneeViewUpdatesComponent implements OnInit {

  constructor() { }
  itemListMode:boolean=null;
  loadingFlag:boolean = null;
  doneeReqsList : DoneeViewUpdateItem[] = [];
  selectedReqDonationsList :DonateRequirement[]=[];
  selectedItem:DoneeViewUpdateItem = null;

  ngOnInit(): void {
    this.loadingFlag = false; //change to true when api implementation is done.
    this.itemListMode = true;
    this.doneeReqsList.push(new DoneeViewUpdateItem("1","Science TextBooks Class 10","Educational","Books","we need 50 textbooks for poor children","50","Available"));
    this.doneeReqsList.push(new DoneeViewUpdateItem("20","In need of 100 laptops","Electronics","Laptops","Need laptops in any condition for children to start learning basics of computers","20","Waiting Donor Approval"));
  }

  viewReqDetails(index:number){
    this.itemListMode = false;
    this.selectedItem = this.doneeReqsList[index];
    if(this.selectedItem.status =="Available"){
      //send post req to server to fetch all the donate update types for this reqId
      this.selectedReqDonationsList.length=0;
      this.selectedReqDonationsList.push(new DonateRequirement("1","30","Excellent","I have a bookstore so I can offer you 30 books"));
      this.selectedReqDonationsList.push(new DonateRequirement("2","10","Decent","I have an electronics shop so I can offer you 10 low budget laptops"));
    }
  }

  viewList(index){
    this.itemListMode = true;
  }

  viewImage(index:number){
    //use index to fetch item id and send get req to server
    
  }
  approveDonation(index:number){

  }
  rejectDonation(index:number){

  }

  deleteRequirement(){
    const id = this.selectedItem.requirementId;
    //send post req with id to delete
    //delete item in service and get updated copy of doneeReqsList
    
  } 
}
