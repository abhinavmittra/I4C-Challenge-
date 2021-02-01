import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import {DonorService} from '../donor.service';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent implements OnInit {

  constructor(private donorService:DonorService,private router:Router,private route:ActivatedRoute,private authService:AuthService) { }
  loadingReqFlag:boolean = true;
  loadingUpdatesFlag:boolean = true;
  
  
  ngOnInit(): void {
  //make get request to server to fetch all item requirements
  //make get request to server to fetch all item updates for this donor
  //use a service to store all this data
  //disable requirements button until data is fetched
  this.loadingReqFlag = true;
  this.loadingUpdatesFlag=true;
  this.donorService.getRequirementsFromServer().subscribe((data)=>{
      this.loadingReqFlag=false
    });
    this.donorService.getDonorUpdatesFromServer(this.authService.getUserId()).subscribe((data)=>{
      this.loadingUpdatesFlag=false;
    });
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
