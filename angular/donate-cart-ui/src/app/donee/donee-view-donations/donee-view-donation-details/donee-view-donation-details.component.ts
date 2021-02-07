import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DonationItem } from 'src/app/model/donation-item';
import { DoneeUpdate } from 'src/app/model/donee-update';
import { DoneeService } from '../../donee.service';

@Component({
  selector: 'app-donee-view-donation-details',
  templateUrl: './donee-view-donation-details.component.html',
  styleUrls: ['./donee-view-donation-details.component.css']
})
export class DoneeViewDonationDetailsComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute,private doneeService:DoneeService,private authService:AuthService) { }
  item:DonationItem = null;
  requestMode:boolean = null;
  imgTestPath = "http://127.0.0.1:5000"
  ngOnInit(): void {
    this.requestMode = false;
    const index = +this.route.snapshot.paramMap.get('id')-1;
    this.item = this.doneeService.getItem(index);
  }

  toggleRequestMode(){
    this.requestMode = !this.requestMode;
  }
  onSubmit(form:NgForm){
    const submitForm = new FormData();
    submitForm.append('quantity',this.item.quantity.toString());
    submitForm.append('details',form.value.details);
    if(!form.value.publicFlag)
    submitForm.append('public',"false");
    else
    submitForm.append('public',form.value.publicFlag)
    submitForm.append('name',this.item.name);
    submitForm.append('itemId',this.item.itemId)
    submitForm.append('subcategory',this.item.subcategory)
    submitForm.append('category',this.item.category)
    submitForm.append('ngoId',this.authService.getUserId())
    submitForm.append('pincode',this.authService.getPincode())
    submitForm.append('ngoName',this.authService.getName())

    this.doneeService.requestItem(submitForm).subscribe((data)=>{
      var doneeUpdates:DoneeUpdate[];
        doneeUpdates =  this.doneeService.getDoneeUpdates();
      var reqUpdates = [{
        "updateType":"donateRequest",
        "reqId":data["requirementId"],
        "itemId":this.item.itemId,
        "ngoId":this.authService.getUserId(),
        "donorId":this.item.donorId,
        "updateDate":new Date().toISOString()
    }]
      doneeUpdates.push(new DoneeUpdate(data["requirementId"],this.item.name,this.item.category,
      this.item.subcategory,this.item.quantity.toString(),form.value.details,new Date().toISOString(),reqUpdates))
      this.doneeService.setDoneeUpdates(doneeUpdates);

      form.reset();
      this.toggleRequestMode();
      this.router.navigate(['/donee/updates'])
    });
  }
  viewItemImage(){
   const imgPath = this.imgTestPath+this.item.imgLink;
   window.open(imgPath);

  }
}
