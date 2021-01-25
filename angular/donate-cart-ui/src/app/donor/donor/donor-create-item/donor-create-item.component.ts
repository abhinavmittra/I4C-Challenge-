import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {DonationItem} from '../../../model/donation-item';
@Component({
  selector: 'app-donor-create-item',
  templateUrl: './donor-create-item.component.html',
  styleUrls: ['./donor-create-item.component.css']
})
export class DonorCreateItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit(form:NgForm){
    console.log(form);
    //send post req to server to create new item in db
  }

}
