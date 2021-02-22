import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { DoneeService } from 'src/app/donee/donee.service';
import { DonorService } from 'src/app/donor/donor.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  constructor(private router: Router,private authService:AuthService,private doneeService:DoneeService,private donorService:DonorService) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
  
    this.authService.loginUser(form.value.email,form.value.password).subscribe((data)=>{
      if(data['role']=="donor"){
        if(data['pass']=true){
          this.authService.setAuthInfo(true);
          this.authService.setUserId(data['id']);
          this.authService.setPincode(data['pincode']);
          this.authService.setName(data['name'])
          this.authService.showLogout.next(true);
          this.donorService.currentPageChanged.next("requirements");
          this.router.navigate(['donor/requirements/list']);
          
        }

      }
      else if(data['role']=="NGO"){
        if(data['pass']==true&&data['verified']==true){
          this.authService.setAuthInfo(true);
          this.authService.setUserId(data['id']);
          this.authService.setPincode(data['pincode']);
          this.authService.setName(data['ngoName']);
          this.authService.showLogout.next(true);
          this.doneeService.currentPageChanged.next("donations");
          this.router.navigate(['donee/donations/list']);
        }
        else if(data['pass']==true&&data['verified']!=true){
          alert("Your registration hasn't been approved yet")
        }
      }
      else if(data['role']=="admin"){
        if(data['pass']==true){
          this.authService.setAuthInfo(true);
          this.authService.setUserId(data['id']);
          this.authService.setName(data["name"])
          this.authService.showLogout.next(true);
          this.router.navigate(['admin']);
        }
       
      }
    console.log(data);
  });
  }

  routeToRegister(){
    this.router.navigate(['register'])
  }
}
