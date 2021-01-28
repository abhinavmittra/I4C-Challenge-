import { Component, OnInit } from '@angular/core';
import {DonorService} from '../../donor.service';
import {ItemRequirement} from '../../../model/item-requirement';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-donor-view-requirements',
  templateUrl: './donor-view-requirements.component.html',
  styleUrls: ['./donor-view-requirements.component.css']
})
export class DonorViewRequirementsComponent implements OnInit {

  constructor(private donorService:DonorService,private router:Router,private route:ActivatedRoute) { }
  itemRequirementList:ItemRequirement[] = [];
  ngOnInit(): void {
    //fetch item requirement list from service

    this.itemRequirementList.push(new ItemRequirement("science class 10 ncert","Education","books","Need 5 text books for children",50,"U&I","some ngo id"));
  }
  viewDetails(index:number){
    
    this.router.navigate(['details'],{relativeTo:this.route});
  }
}
