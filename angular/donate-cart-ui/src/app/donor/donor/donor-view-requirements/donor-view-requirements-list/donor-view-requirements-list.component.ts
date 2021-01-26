import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemRequirement } from 'src/app/model/item-requirement';

@Component({
  selector: 'app-donor-view-requirements-list',
  templateUrl: './donor-view-requirements-list.component.html',
  styleUrls: ['./donor-view-requirements-list.component.css']
})
export class DonorViewRequirementsListComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }
  itemRequirementList:ItemRequirement[] = [];
  ngOnInit(): void {
    this.itemRequirementList.push(new ItemRequirement("science class 10 ncert","Education","books","Need 5 text books for children",50,"class 10 unprivileged children","U&I","some ngo id"));
  }
  viewDetails(index:number){
    
    this.router.navigate(['../details'],{relativeTo:this.route});
  }
}
