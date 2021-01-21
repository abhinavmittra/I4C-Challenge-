import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    //send post req to server with auth details and navigate user to admin/ngo/donor views based on role
  }

  routeToRegister(){
    this.router.navigate(['register'])
  }
}
