
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationItem } from 'src/app/model/donation-item';

@Component({
  selector: 'app-donee-view-donation-list',
  templateUrl: './donee-view-donation-list.component.html',
  styleUrls: ['./donee-view-donation-list.component.css']
})
export class DoneeViewDonationListComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }
  
  itemDonationsList:DonationItem[]=[];
  ngOnInit(): void {
    this.itemDonationsList.push(new DonationItem("Canvas Shoes","Clothing","Shoes","I have 2 pairs of shoes which i dont need",2,7,"some id"))

  }
  viewItem(index:number){
    this.router.navigate(['../details'],{relativeTo:this.route});
  }
}
