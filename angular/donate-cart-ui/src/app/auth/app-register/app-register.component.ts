import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import {Donee} from '../../model/donee';
import {Donor} from '../../model/donor';
@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css']
})
export class AppRegisterComponent implements OnInit {

  constructor(private router:Router) { }

  registerType:string=null;


  ngOnInit(): void {
    this.registerType="none";
  }

  setRegisterType(regType:string){
    this.registerType = regType;
    console.log(regType);
  }
  routeToLogin(){
    this.router.navigate(['login'])
  }

  onSubmit(form:NgForm){
    console.log(form)

    if(this.registerType=="donor"){
      const email = form.value.email;
      const pass = form.value.password;
      const name = form.value.name;
      const address=form.value.address;
      const phone = form.value.phone;
      const pincode = form.value.pincode;
      var donor:Donor = new Donor(name,address,pincode,phone,email,pass);
    }
    else if(this.registerType=="donee"){
      const email = form.value.email;
      const pass = form.value.password;
      const name = form.value.name;
      const address=form.value.address;
      const phone = form.value.phone;
      const pincode = form.value.pincode;
      const website = form.value.website;
      const panno = form.value.panno;
      var donee:Donee = new Donee(name,address,pincode,phone,panno,website,email,pass);
    }
  }

}
