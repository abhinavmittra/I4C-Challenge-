import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationItem } from 'src/app/model/donation-item';

@Component({
  selector: 'app-donee-view-donation-details',
  templateUrl: './donee-view-donation-details.component.html',
  styleUrls: ['./donee-view-donation-details.component.css']
})
export class DoneeViewDonationDetailsComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }
  item:DonationItem = null;
  requestMode:boolean = null;
  ngOnInit(): void {
    this.requestMode = false;
    this.item = new DonationItem("Canvas Shoes","Clothing","Shoes","I have 2 pairs of shoes which i dont need",2,7,"some id")
  }

  toggleRequestMode(){
    this.requestMode = !this.requestMode;
  }
  onSubmit(form:NgForm){
    console.log(form);
  }
}
