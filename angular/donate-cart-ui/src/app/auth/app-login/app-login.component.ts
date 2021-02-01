import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  constructor(private router: Router,private authService:AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
  
    this.authService.loginUser(form.value.email,form.value.password).subscribe((data)=>{
      if(data['role']=="donor"){
        if(data['pass']=true){
          this.authService.setUserId(data['id']);
          this.authService.setPincode(data['pincode']);
          this.authService.setName(data['name'])
          this.router.navigate(['donor']);
        }

      }
      else if(data['role']=="NGO"){
        if(data['pass']==true&&data['verified']==true){
          this.authService.setUserId(data['id']);
          this.authService.setPincode(data['pincode']);
          this.authService.setName(data['ngoName']);
          this.router.navigate(['donee']);
        }
      }
      else if(data['role']=="admin"){
        if(data['pass']==true){
          this.authService.setUserId(data['id']);
          
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
