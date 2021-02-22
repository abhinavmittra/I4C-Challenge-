import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-donor-view-requirements',
  templateUrl: './donor-view-requirements.component.html',
  styleUrls: ['./donor-view-requirements.component.css']
})
export class DonorViewRequirementsComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    //fetch item requirement list from service

    
  }
  viewDetails(index:number){
    
    this.router.navigate(['details'],{relativeTo:this.route});
  }
}
