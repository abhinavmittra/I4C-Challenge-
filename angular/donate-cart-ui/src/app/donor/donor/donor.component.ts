import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UtilityService } from 'src/app/shared/utility.service';
import {DonorService} from '../donor.service';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent implements OnInit {

  constructor(private donorService:DonorService,private router:Router,private route:ActivatedRoute,private authService:AuthService,private utilityService:UtilityService) { }
  loadingReqFlag:boolean = true;
  loadingUpdatesFlag:boolean = true;
  currentPage :string;
  currentPageChangedSub:Subscription;
  ngOnInit(): void {
  
    this.getFreshData()
    this.currentPageChangedSub=this.donorService.currentPageChanged.subscribe((currentPage:string)=>{
      this.currentPage=currentPage;
    })
  }

  viewRequirements(){
    this.donorService.currentPageChanged.next("requirements");
    this.router.navigate(['requirements/list'],{relativeTo:this.route})
  }
  viewNotifications(){
    this.donorService.currentPageChanged.next("notifications")
    this.router.navigate(['notifications'],{relativeTo:this.route})
  }

  viewUpdates(){
    this.donorService.currentPageChanged.next("updates");
    this.router.navigate(['updates/list'],{relativeTo:this.route})
  }
  donateItem(){
    this.donorService.currentPageChanged.next("donate");
    this.router.navigate(['donate'],{relativeTo:this.route})
  }

  getFreshData(){
    this.loadingReqFlag = true;
    this.loadingUpdatesFlag=true;
  
   //Add seperate loading flag for categories & alerts later
    this.utilityService.getCategoriesFromServer().subscribe()
    this.utilityService.getAlertsFromServer(this.authService.getUserId()).subscribe();

    this.donorService.getRequirementsFromServer(this.authService.getUserId()).subscribe((data)=>{
        this.loadingReqFlag=false
      });
      this.donorService.getDonorUpdatesFromServer(this.authService.getUserId()).subscribe((data)=>{
        this.loadingUpdatesFlag=false;
      });
  }

  ngOnDestroy(){
    this.currentPageChangedSub.unsubscribe()
  }
  

  


}
