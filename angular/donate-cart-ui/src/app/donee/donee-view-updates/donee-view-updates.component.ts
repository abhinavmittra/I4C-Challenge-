import { Component, OnInit } from '@angular/core';
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
  

  ngOnInit(): void {
    this.loadingFlag = false; //change to true when api implementation is done.
  
  }

  viewReqDetails(index:number){
    
   
    
  }

  viewList(index){
   
  }

  viewImage(index:number){
    //use index to fetch item id and send get req to server
    
  }
  approveDonation(index:number){

  }
  rejectDonation(index:number){

  }

  deleteRequirement(){
   
    //send post req with id to delete
    //delete item in service and get updated copy of doneeReqsList
    
  } 
}
