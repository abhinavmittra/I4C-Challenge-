import { Component, OnInit } from '@angular/core';
import { DoneeReg } from '../donee-reg';
import {AdminService} from '../admin.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private adminService:AdminService) { }
  public ngoRegRequests : DoneeReg[] = [];
  ngOnInit(): void {
    //Make a get request to server to fetch all donee objects with pending registration.

    //Demo variable to check out layout

    var doneeObj = new DoneeReg("ngo 1","address 1","pincode 1","phone 1","panno 1","web1","email1");
    this.ngoRegRequests.push(doneeObj);
  }
  approveRequest(index:number){
    this.ngoRegRequests.splice(index,1);
    this.adminService.approveNgo().subscribe();
  }
  rejectRequest(index:number){
    this.ngoRegRequests.splice(index,1);
    this.adminService.rejectNgo().subscribe();
  }

}
