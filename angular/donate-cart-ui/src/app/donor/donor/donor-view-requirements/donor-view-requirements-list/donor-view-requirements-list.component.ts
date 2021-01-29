import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DonorService} from 'src/app/donor/donor.service';
import { ItemRequirement } from 'src/app/model/item-requirement';

@Component({
  selector: 'app-donor-view-requirements-list',
  templateUrl: './donor-view-requirements-list.component.html',
  styleUrls: ['./donor-view-requirements-list.component.css']
})
export class DonorViewRequirementsListComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute,private donorService:DonorService) { }
  itemRequirementList:ItemRequirement[] = [];
  itemRequirementsChangedSubscription:Subscription;
  
  ngOnInit(): void {
  
    this.itemRequirementsChangedSubscription=this.donorService.publicItemRequirementsChanged.subscribe((data:ItemRequirement[])=>{
      this.itemRequirementList = data;
    });  
  
  }
  viewDetails(index:number){
    
    this.router.navigate(['../details'],{relativeTo:this.route});
  }
  ngOnDestroy(){
    this.itemRequirementsChangedSubscription.unsubscribe();
  }
}
