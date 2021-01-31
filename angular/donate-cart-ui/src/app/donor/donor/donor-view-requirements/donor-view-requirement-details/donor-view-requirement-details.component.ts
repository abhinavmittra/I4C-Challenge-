import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DonorService } from 'src/app/donor/donor.service';
import { ItemRequirement } from 'src/app/model/item-requirement';

@Component({
  selector: 'app-donor-view-requirement-details',
  templateUrl: './donor-view-requirement-details.component.html',
  styleUrls: ['./donor-view-requirement-details.component.css']
})
export class DonorViewRequirementDetailsComponent implements OnInit {

  constructor(private authService:AuthService,private router:Router,private route:ActivatedRoute,private donorService:DonorService) { }
  item:ItemRequirement=null;
  donateMode:boolean = null;
  selectedImage:File = null;
  ngOnInit(): void {
    this.donateMode = false;
    const itemIdx = +this.route.snapshot.paramMap.get('id')-1
    this.item= this.donorService.getItemRequirement(itemIdx);
  }

  onSubmit(form:NgForm){
    const submitForm = new FormData();
    submitForm.append('image',this.selectedImage,this.selectedImage.name);
    submitForm.append('quantity',form.value.quantity);
    submitForm.append('quality',form.value.quality);
    submitForm.append('details',form.value.details);
    if(!form.value.publicFlag)
    submitForm.append('public',"false");
    else
    submitForm.append('public',form.value.publicFlag)

    submitForm.append('name',this.item.name);
    submitForm.append('requirementId',this.item.requirementId)
    submitForm.append('subcategory',this.item.subcategory)
    submitForm.append('category',this.item.category)
    submitForm.append('ngoId',this.item.ngoId)
    submitForm.append('donorId',this.authService.getUserId())
    submitForm.append('pincode',this.authService.getPincode())
    
    
    //send post req with submitForm attached to server to create new item in db
    this.donorService.donateItem(submitForm).subscribe((data)=>{
      form.reset();
      this.toggleDonateMode();
    });
  }

  toggleDonateMode(){
    this.donateMode = !this.donateMode;
  }
  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
  }
}
