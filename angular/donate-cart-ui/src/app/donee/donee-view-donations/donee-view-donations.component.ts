import { Component, OnInit } from '@angular/core';
import {DonationItem} from '../../model/donation-item';
import {DoneeService} from '../donee.service';
@Component({
  selector: 'app-donee-view-donationss',
  templateUrl: './donee-view-donations.component.html',
  styleUrls: ['./donee-view-donations.component.css']
})
export class DoneeViewDonationsComponent implements OnInit {

  constructor(private doneeService:DoneeService) { }

  itemDonationsList:DonationItem[]=[];
  ngOnInit(): void {
    this.itemDonationsList.push(new DonationItem("Canvas Shoes","Clothing","Shoes","I have 2 pairs of shoes which i dont need",2,7,"some id"))
  }

  requestItem(index:number){
    this.itemDonationsList.splice(index,1);
    this.doneeService.requestItem(index).subscribe();
  }
}
