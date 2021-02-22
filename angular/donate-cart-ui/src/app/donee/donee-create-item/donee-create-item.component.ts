import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { SubmitRequirement } from 'src/app/model/submit-requirement';
import {DoneeService} from '../donee.service'
import {DoneeUpdate} from '../../model/donee-update';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryInfo } from 'src/app/model/category-info';
import { UtilityService } from 'src/app/shared/utility.service';
@Component({
  selector: 'app-donee-create-item',
  templateUrl: './donee-create-item.component.html',
  styleUrls: ['./donee-create-item.component.css']
})
export class DoneeCreateItemComponent implements OnInit {

  constructor(private doneeService:DoneeService,private authService:AuthService,private router:Router,private utilityService:UtilityService) { }
  filteredSubCategories:string[]=[]; //active list set for choosing subcategory
  categoryInfoList:CategoryInfo[]=[];
  categoryInfoListChanged:Subscription;
  ngOnInit(): void {
    //get category list from service
    this.categoryInfoList = this.utilityService.getCategoryInfo();
    //Subcribe to categoryList Changes
    this.categoryInfoListChanged = this.utilityService.categoryInfoListChanged.subscribe((data)=>{
      this.categoryInfoList = data;
      console.log(this.categoryInfoList)
      //set filterSubCategories to 1st category's subcategories.

      this.filteredSubCategories = this.categoryInfoList[0].subCategories;
    })
  }
  onCategoryChange(event:any){
    var categorySelected = event.target.value.split(" ")[1]
    for(var i =0;i<this.categoryInfoList.length;i++){
      if(categorySelected==this.categoryInfoList[i].name){
        this.filteredSubCategories=this.categoryInfoList[i].subCategories
        break;
      }
    }
    
  }
  onSubmit(form:NgForm){
    const submitForm = new FormData();
    
    submitForm.append('name',form.value.name);
    submitForm.append('category',form.value.category);
    submitForm.append('subcategory',form.value.subcategory);
    submitForm.append('quantity',form.value.quantity);
    submitForm.append('details',form.value.details);
    submitForm.append('ngoId',this.authService.getUserId());
    submitForm.append('ngoName',this.authService.getName());
    submitForm.append('pincode',this.authService.getPincode());  

    this.doneeService.createItemRequirement(submitForm).subscribe((data)=>{
      console.log(data)
        var doneeUpdates:DoneeUpdate[];
        doneeUpdates =  this.doneeService.getDoneeUpdates();
   
        
        var reqUpdates = [{
          "updateType":"noupdate",
          "ngoId":this.authService.getUserId(),
          "reqId":data["requirementId"],
          "updateDate":new Date().toISOString()
      }]
        doneeUpdates.push(new DoneeUpdate(data["requirementId"],form.value.name,form.value.category,
        form.value.subcategory,form.value.quantity,form.value.details,new Date().toISOString(),reqUpdates))
        this.doneeService.setDoneeUpdates(doneeUpdates);
       
       
        form.reset();
        //update currentPage local variable
        this.doneeService.setCurrentPage("updates")
        this.router.navigate(['/donee/updates/list'])
      });
      
     
    
  }
}
