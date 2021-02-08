import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { SubmitRequirement } from 'src/app/model/submit-requirement';
import {DoneeService} from '../donee.service'
import {DoneeUpdate} from '../../model/donee-update';
import { Router } from '@angular/router';
@Component({
  selector: 'app-donee-create-item',
  templateUrl: './donee-create-item.component.html',
  styleUrls: ['./donee-create-item.component.css']
})
export class DoneeCreateItemComponent implements OnInit {

  constructor(private doneeService:DoneeService,private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    console.log(form);
    // this.doneeService.createItemRequirement(new SubmitRequirement(form.value.name,
    //   form.value.category,form.value.subcategory,form.value.details,form.value.quantity,
    //   this.authService.getUserId(),this.authService.getPincode(),this.authService.getName())).subscribe((data)=>{
    //     var doneeUpdates:DoneeUpdate[];
    //     doneeUpdates =  this.doneeService.getDoneeUpdates();
   
        
    //     var reqUpdates = [{
    //       "updateType":"noupdate",
    //       "ngoId":this.authService.getUserId(),
    //       "reqId":data["requirementId"],
    //       "updateDate":new Date().toISOString()
    //   }]
    //     doneeUpdates.push(new DoneeUpdate(data["requirementId"],form.value.name,form.value.category,
    //     form.value.subcategory,form.value.quantity,form.value.details,new Date().toISOString(),reqUpdates))
    //     this.doneeService.setDoneeUpdates(doneeUpdates);
       
       
    //     form.reset();
    //     //update currentPage local variable
    //     this.doneeService.setCurrentPage("updates")
    //     this.router.navigate(['/donee/updates'])
    //   });
      
     
    
  }
}
