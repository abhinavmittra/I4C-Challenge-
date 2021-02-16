import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import {Donee} from '../../model/donee';
import {Donor} from '../../model/donor';
import {AuthService} from '../auth.service';
@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css']
})
export class AppRegisterComponent implements OnInit {

  constructor(private router:Router,private authService:AuthService) { }

  registerType:string=null;
  ngoPanMode:boolean=false;
  ngoForm12a:File=null;
  ngoForm80g:File=null;
  ngoForm:FormData=new FormData();


  imageLoaded:boolean=false;
  imageString:string;
  ngOnInit(): void {
    this.registerType="none";
    this.ngoPanMode = false;
    //Testing base64 image view fn
    this.getImageTest()
  }

  setRegisterType(regType:string){
    this.registerType = regType;
    console.log(regType);
  }
  routeToLogin(){
    this.router.navigate(['login'])
  }

  onSubmit(form:NgForm){
    if(this.registerType=="donor"){
      const email = form.value.email;
      const pass = form.value.password;
      const name = form.value.name;
      const address=form.value.address;
      const phone = form.value.phone;
      const pincode = form.value.pincode;
      var donor:Donor = new Donor(name,address,pincode,phone,email,pass);
      this.authService.registerDonor(donor).subscribe((data)=>{
        this.router.navigate(['/login'])
        console.log(data)
      });
     
    }
    else if(this.registerType=="donee"){
      const email = form.value.email;
      this.ngoForm.append("Email",email)
      const pass = form.value.password;
      this.ngoForm.append("PasswordHash",pass)
      const name = form.value.name;
      this.ngoForm.append("NGOName",name)
      const address=form.value.address;
      this.ngoForm.append("Address",address)
      const phone = form.value.phone;
      this.ngoForm.append("Phone",phone)
      const pincode = form.value.pincode;
      this.ngoForm.append("Pincode",pincode)
      const website = form.value.website;
      this.ngoForm.append("Website",website)    
      const desc = form.value.description;
      this.ngoForm.append("description",desc)    
      this.ngoPanMode= true;
      console.log(this.ngoPanMode)
      
    }
  }
  onForm12aSelected(event){
    this.ngoForm12a = <File>event.target.files[0];
  }
  onForm80gSelected(event){
    this.ngoForm80g = <File>event.target.files[0];
  }

  onSubmitNgoAdditonalInfo(form:NgForm){
    const panno = form.value.panno;
    this.ngoForm.append("PAN",panno)
    this.ngoForm.append('ngoForm12a',this.ngoForm12a,this.ngoForm12a.name);
    this.ngoForm.append('ngoForm80g',this.ngoForm80g,this.ngoForm80g.name);
    this.ngoForm.append('comments',form.value.doneecomments)
    console.log(this.ngoForm)
    //var donee:Donee = new Donee(name,address,pincode,phone,panno,website,desc,email,pass);
    this.authService.registerDonee(this.ngoForm).subscribe((data)=>{
      this.router.navigate(['/login'])
      console.log(data)
    });

  }
//To test base64 image viewing
  getImageTest(){
    this.authService.getImageFromServer("BLKipXcBxkTH7-pAhZ6I").subscribe((data)=>{
      console.log(data)
      this.imageString = "data:image/jpeg;base64,"+data["image"]
      console.log(this.imageString)
      this.imageLoaded=true;
    })
  }


}
