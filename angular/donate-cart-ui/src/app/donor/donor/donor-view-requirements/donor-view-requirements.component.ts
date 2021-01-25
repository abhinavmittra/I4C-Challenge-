import { Component, OnInit } from '@angular/core';
import {DonorService} from '../../donor.service';
import {ItemRequirement} from '../../../model/item-requirement';
@Component({
  selector: 'app-donor-view-requirements',
  templateUrl: './donor-view-requirements.component.html',
  styleUrls: ['./donor-view-requirements.component.css']
})
export class DonorViewRequirementsComponent implements OnInit {

  constructor(private donorService:DonorService) { }
  itemRequirementList:ItemRequirement[] = [];
  ngOnInit(): void {
    //fetch item requirement list from service

    this.itemRequirementList.push(new ItemRequirement("science class 10 ncert","Education","books","Need 5 text books for children",50,"class 10 unprivileged children","U&I"));
  }
  donateItem(index:number){
    this.itemRequirementList.splice(index,1);
    this.donorService.donateItem().subscribe();
  }
}
