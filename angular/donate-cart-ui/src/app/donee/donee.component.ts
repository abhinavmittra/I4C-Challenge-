import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DoneeService } from './donee.service';

@Component({
  selector: 'app-donee',
  templateUrl: './donee.component.html',
  styleUrls: ['./donee.component.css']
})
export class DoneeComponent implements OnInit {

  constructor(private router:Router,private route: ActivatedRoute,private doneeService:DoneeService,private authService:AuthService) { }
  loadingItemsFlag:boolean = true;
  loadingUpdatesFlag = true;
  ngOnInit(): void {
  
  this.loadingItemsFlag = true;
  this.loadingUpdatesFlag = true;
  this.doneeService.getAvailableDonationsFromServer().subscribe((data)=>{
      this.loadingItemsFlag=false
      
    });
    this.doneeService.getDoneeUpdatesFromServer(this.authService.getUserId()).subscribe((data)=>{
      this.loadingUpdatesFlag=false;
    });

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
