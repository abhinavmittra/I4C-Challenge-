import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    //add logic for sending data to backend for auth
  }
}
