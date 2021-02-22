import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UtilityService } from '../shared/utility.service';
import { DoneeService } from './donee.service';

@Component({
  selector: 'app-donee',
  templateUrl: './donee.component.html',
  styleUrls: ['./donee.component.css']
})
export class DoneeComponent implements OnInit {

  constructor(private utilityService:UtilityService,private router:Router,private route: ActivatedRoute,private doneeService:DoneeService,private authService:AuthService) { }
  loadingItemsFlag:boolean = true;
  loadingUpdatesFlag = true;
  loadingCategoriesFlag = true;
  loadingAlertsFlag=true;
  currentPage:string;
  currentPageChangedSub:Subscription;
  ngOnInit(): void {
  //Subscribe to currentPage Variable
    
  this.currentPageChangedSub=this.doneeService.currentPageChanged.subscribe((currentPage:string)=>{
    this.currentPage = currentPage;
  })

  this.getFreshData();
  

}
  viewDonations(){
    this.doneeService.currentPageChanged.next("donations");
    this.router.navigate(['donations/list'],{relativeTo:this.route})
  }
  createItemRequirement(){
    this.doneeService.currentPageChanged.next("request");
    this.router.navigate(['create'],{relativeTo:this.route})
  }
  viewMyRequirements(){
    this.doneeService.currentPageChanged.next("updates");
    this.router.navigate(['updates/list'],{relativeTo:this.route})
  }
  viewNotifications(){
    this.doneeService.currentPageChanged.next("notifications")
    this.router.navigate(['notifications'],{relativeTo:this.route})
  }
  getFreshData(){
    this.loadingItemsFlag = true;
    this.loadingUpdatesFlag = true;
    this.loadingCategoriesFlag = true;
    this.loadingAlertsFlag=true;
    //Add seperate loading flag for categories & alerts later
    this.utilityService.getCategoriesFromServer().subscribe((data)=>{
      this.loadingCategoriesFlag=false;
    })
    this.utilityService.getAlertsFromServer(this.authService.getUserId()).subscribe((data)=>{
      this.loadingAlertsFlag=false;
    });

    
    this.doneeService.getAvailableDonationsFromServer(this.authService.getUserId()).subscribe((data)=>{
        this.loadingItemsFlag=false
        
      });
      this.doneeService.getDoneeUpdatesFromServer(this.authService.getUserId()).subscribe((data)=>{
        this.loadingUpdatesFlag=false;
      });
  }
  ngOnDestroy(){
    this.currentPageChangedSub.unsubscribe();
  }
}
