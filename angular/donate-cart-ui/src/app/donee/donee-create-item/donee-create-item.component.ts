import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { SubmitRequirement } from 'src/app/model/submit-requirement';
import {DoneeService} from '../donee.service'
@Component({
  selector: 'app-donee-create-item',
  templateUrl: './donee-create-item.component.html',
  styleUrls: ['./donee-create-item.component.css']
})
export class DoneeCreateItemComponent implements OnInit {

  constructor(private doneeService:DoneeService,private authService:AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    console.log(form);
    this.doneeService.createItemRequirement(new SubmitRequirement(form.value.name,
      form.value.category,form.value.subcategory,form.value.details,form.value.quantity,
      this.authService.getUserId(),this.authService.getPincode(),this.authService.getName())).subscribe((data)=>{
        console.log(data);
        form.reset();
      });

    
  }
}
