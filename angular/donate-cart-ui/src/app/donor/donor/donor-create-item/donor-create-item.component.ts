import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { DonorService } from '../../donor.service';
import {DonorUpdate} from '../../../model/donor-update'
@Component({
  selector: 'app-donor-create-item',
  templateUrl: './donor-create-item.component.html',
  styleUrls: ['./donor-create-item.component.css']
})
export class DonorCreateItemComponent implements OnInit {

  constructor(private donorService:DonorService,private authService:AuthService) { }
  selectedImage:File = null;
  baseUrl = "http:127.0.0.1:5000"
  ngOnInit(): void {
    

  }

  onSubmit(form:NgForm){
    console.log(form);
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
 
     
      var itemUpdates = {"updateType":"noupdate"}
      donorUpdates.push(new DonorUpdate(data["itemId"],form.value.name,form.value.category,
      form.value.subcategory,form.value.quantity,form.value.quality,form.value.details,this.baseUrl+"/uploads/"+data["itemId"]+".jpg",new Date().toISOString(),itemUpdates))
      this.donorService.setDonorUpdates(donorUpdates);
    });
  }

  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
  }

}
