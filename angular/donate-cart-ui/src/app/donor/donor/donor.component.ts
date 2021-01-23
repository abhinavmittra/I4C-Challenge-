import { Component, OnInit } from '@angular/core';
import {ItemRequirement} from '../../model/item-requirement';
@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent implements OnInit {

  constructor() { }
  itemRequirementList:ItemRequirement[] = [];
  ngOnInit(): void {

    //make get request to server to fetch all item requirements
    //make get request to server to fetch all item updates for this donor
  }

}
