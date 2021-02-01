import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { DonorService } from 'src/app/donor/donor.service';
import {DonorViewUpdateItem} from '../../../model/donor-view-update-item';
import {RequestItem} from '../../../model/request-item';
import {Subscription} from 'rxjs'
import { DonorUpdate } from 'src/app/model/donor-update';
@Component({
  selector: 'app-donor-view-updates',
  templateUrl: './donor-view-updates.component.html',
  styleUrls: ['./donor-view-updates.component.css']
})
export class DonorViewUpdatesComponent implements OnInit {

  constructor(private donorService:DonorService,private authService:AuthService) { }

 
  donorUpdates:DonorUpdate[]=[]
  donorUpdatesChanged:Subscription;
  ngOnInit(): void {
    this.getDonorUpdates();
   
    
   
  }

  getDonorUpdates(){
  this.donorUpdatesChanged= this.donorService.donorUpdatesChanged.subscribe((data:DonorUpdate[])=>{
    this.donorUpdates=data;
  });
   
  }


  viewImage(){
    
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
