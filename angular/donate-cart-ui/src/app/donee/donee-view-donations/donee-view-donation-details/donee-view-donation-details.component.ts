import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DonationItem } from 'src/app/model/donation-item';
import { DoneeUpdate } from 'src/app/model/donee-update';
import { UtilityService } from 'src/app/shared/utility.service';
import { DoneeService } from '../../donee.service';

@Component({
  selector: 'app-donee-view-donation-details',
  templateUrl: './donee-view-donation-details.component.html',
  styleUrls: ['./donee-view-donation-details.component.css']
})
export class DoneeViewDonationDetailsComponent implements OnInit {

  constructor(private utilityService:UtilityService,private router:Router,private route:ActivatedRoute,private doneeService:DoneeService,private authService:AuthService) { }
  item:DonationItem = null;
  requestMode:boolean = null;
  imgMode:boolean=false;
  imageLoaded:boolean=false;
  imageString:string;
  selectedImage:File=null;
  ngOnInit(): void {
    this.requestMode = false;
    const index = +this.route.snapshot.paramMap.get('id')-1;
    this.item = this.doneeService.getItem(index);
  }

  toggleRequestMode(){
    this.requestMode = !this.requestMode;
  }
  onSubmit(form:NgForm){
    console.log(this.item.requestLimit)
    //add validation for requesting Quantity

    if(form.value.quantity>this.item.requestLimit){
      alert("You can not request a quantity larger than the request limit for this item")
    }

else{
    const submitForm = new FormData();
    submitForm.append('quantity',form.value.quantity);
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
      this.doneeService.setCurrentPage("updates")
      this.router.navigate(['/donee/updates'])
    });
  }
}
  viewItemImage(){
  

   this.imageString="";
    this.imgMode=true;
    this.utilityService.getImageFromServer(this.item.imgLink).subscribe((data)=>{
      if(data["image"]!="-1"){
      this.imageString = "data:image/jpeg;base64,"+data["image"]
      this.imageLoaded=true;
      }
      else{
        this.imageString=="-1";
        this.imageLoaded=false;
      }
    })
    // const imgPath = this.imgTestPath+this.item.imgLink;
  // window.open(imgPath);

  }



  showDonations(){
    this.imgMode=false;
    this.imageLoaded = false;
  }
  routeToDonations(){
    this.doneeService.setCurrentPage("donations")
    this.router.navigate(['/donee/donations/list'])
  }
}
