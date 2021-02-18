import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UtilityService } from 'src/app/shared/utility.service';
import {CategoryInfo} from 'src/app/model/category-info';
import { Subscription } from 'rxjs';
import { DonorService } from '../../donor.service';
import {DonorUpdate} from 'src/app/model/donor-update';
@Component({
  selector: 'app-donor-create-item',
  templateUrl: './donor-create-item.component.html',
  styleUrls: ['./donor-create-item.component.css']
})
export class DonorCreateItemComponent implements OnInit {

  constructor(private donorService:DonorService,private authService:AuthService,private utilityService:UtilityService,private router:Router) { }
  selectedImage:File = null;
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
    
    console.log(form);
    console.log(form.value.quality)
    console.log(form.value.subcategory)
    console.log(form.value.category)
    
    const submitForm = new FormData();
    submitForm.append('image',this.selectedImage,this.selectedImage.name);
    submitForm.append('name',form.value.name);
    submitForm.append('category',form.value.category);
    submitForm.append('subcategory',form.value.subcategory);
    submitForm.append('quantity',form.value.quantity);
    submitForm.append('quality',form.value.quality);
    submitForm.append('details',form.value.details);
    submitForm.append('donorId',this.authService.getUserId());
    submitForm.append('pincode',this.authService.getPincode());    

    //send post req with submitForm attached to server to create new item in db
    this.donorService.createDonationItem(submitForm).subscribe((data)=>{
      var donorUpdates:DonorUpdate[];
      donorUpdates =  this.donorService.getDonorUpdates();
 
     
      var itemUpdates = [{
        "updateType":"noupdate",
        "donorId":this.authService.getUserId(),
        "itemId":data["itemId"],
        "updateDate":new Date().toISOString()
      }]
      donorUpdates.push(new DonorUpdate(data["itemId"],form.value.name,form.value.category,
      form.value.subcategory,form.value.quantity,form.value.quality,form.value.details,data["imageLink"],new Date().toISOString(),itemUpdates))
      this.donorService.setDonorUpdates(donorUpdates);
      form.reset();
      //update currentPage in service
      this.donorService.currentPageChanged.next("updates");
      this.router.navigate(['/donor/updates'])
    });
  }
  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
  }

  ngOnDestroy(){
    this.categoryInfoListChanged.unsubscribe()
  }
}
