import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {DonorService} from '../donor.service';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent implements OnInit {

  constructor(private donorService:DonorService,private router:Router,private route:ActivatedRoute) { }
 
  ngOnInit(): void {
  //make get request to server to fetch all item requirements
  //make get request to server to fetch all item updates for this donor
  //use a service to store all this data
  //disable requirements button until data is fetched
    
  }

  viewRequirements(){
    this.router.navigate(['requirements/list'],{relativeTo:this.route})
  }

  viewUpdates(){
    this.router.navigate(['updates'],{relativeTo:this.route})
  }
  donateItem(){
    this.router.navigate(['donate'],{relativeTo:this.route})
  }

  

  


}
