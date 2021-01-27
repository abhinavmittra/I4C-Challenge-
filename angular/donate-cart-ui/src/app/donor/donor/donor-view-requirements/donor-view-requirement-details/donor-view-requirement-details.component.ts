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
  selectedImage:File = null;
  ngOnInit(): void {
    this.donateMode = false;
    this.item= new ItemRequirement("science class 10 ncert","Education","books","Need 5 text books for children",50,"class 10 unprivileged children","U&I","some ngo id");
  }

  onSubmit(form:NgForm){
    const submitForm = new FormData();
    submitForm.append('image',this.selectedImage,this.selectedImage.name);
    submitForm.append('quantity',form.value.quantity);
    submitForm.append('quality',form.value.quality);
    submitForm.append('details',form.value.details);
    submitForm.append('public',form.value.publicFlag);
    console.log(submitForm.get('image'));
    console.log(submitForm.get('public'));
    //send post req with submitForm attached to server to create new item in db
  }

  toggleDonateMode(){
    this.donateMode = !this.donateMode;
  }
  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
  }
}
