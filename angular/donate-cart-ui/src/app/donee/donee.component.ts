import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-donee',
  templateUrl: './donee.component.html',
  styleUrls: ['./donee.component.css']
})
export class DoneeComponent implements OnInit {

  constructor(private router:Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
  //make get request to server to fetch all item donations
  //make get request to server to fetch all requirements/donations this person has added or requested for.
  //use a service to store all this data
  //disable My Requirements button until data is fetched
  }
  viewDonations(){
    this.router.navigate(['donations/list'],{relativeTo:this.route})
  }
  createItemRequirement(){
    this.router.navigate(['create'],{relativeTo:this.route})
  }
  viewMyRequirements(){
    this.router.navigate(['updates'],{relativeTo:this.route})
  }
}
