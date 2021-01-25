import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-donee-create-item',
  templateUrl: './donee-create-item.component.html',
  styleUrls: ['./donee-create-item.component.css']
})
export class DoneeCreateItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    console.log(form);
  }
}
