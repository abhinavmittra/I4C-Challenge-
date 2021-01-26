import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemRequirement } from 'src/app/model/item-requirement';

@Component({
  selector: 'app-donor-view-requirement-details',
  templateUrl: './donor-view-requirement-details.component.html',
  styleUrls: ['./donor-view-requirement-details.component.css']
})
export class DonorViewRequirementDetailsComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }
  item:ItemRequirement=null;
  donateMode:boolean = null;

  ngOnInit(): void {
    this.donateMode = false;
    this.item= new ItemRequirement("science class 10 ncert","Education","books","Need 5 text books for children",50,"class 10 unprivileged children","U&I","some ngo id");
  }

  onSubmit(form:NgForm){
    console.log(form);
  }

  toggleDonateMode(){
    this.donateMode = !this.donateMode;
  }
  
}
