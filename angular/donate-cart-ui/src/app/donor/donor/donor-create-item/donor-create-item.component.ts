import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { DonorService } from '../../donor.service';
@Component({
  selector: 'app-donor-create-item',
  templateUrl: './donor-create-item.component.html',
  styleUrls: ['./donor-create-item.component.css']
})
export class DonorCreateItemComponent implements OnInit {

  constructor(private donorService:DonorService,private authService:AuthService) { }
  selectedImage:File = null;
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
    submitForm.append('donorID',this.authService.getUserId());
    submitForm.append('pincode',this.authService.getPincode());    

    //send post req with submitForm attached to server to create new item in db
    this.donorService.createDonationItem(submitForm).subscribe((data)=>{
    console.log(data)
    });
  }

  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
  }

}
