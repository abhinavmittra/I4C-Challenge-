
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DonationItem } from 'src/app/model/donation-item';
import { DoneeService } from '../../donee.service';

@Component({
  selector: 'app-donee-view-donation-list',
  templateUrl: './donee-view-donation-list.component.html',
  styleUrls: ['./donee-view-donation-list.component.css']
})
export class DoneeViewDonationListComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute,private doneeService:DoneeService) { }
  
  donationItemsList:DonationItem[]=[];
  donationItemsChangedSubscription:Subscription;
  ngOnInit(): void {
    this.getItems();
  }
  getItems(){
    this.donationItemsList = this.doneeService.getPublicItems();
    this.donationItemsChangedSubscription=this.doneeService.publicItemsChanged.subscribe((data:DonationItem[])=>{
      this.donationItemsList = data;
    }); 
  }
  viewItem(index:number){
    this.router.navigate(['../details',index+1],{relativeTo:this.route});
  }
}
