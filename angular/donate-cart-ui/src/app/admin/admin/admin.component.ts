import { Component, OnInit } from '@angular/core';
import { DoneeApproveReq} from '../../model/donee-approve-req';
import {AdminService} from '../admin.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private adminService:AdminService) { }
  public ngoRegRequests : DoneeApproveReq[] = [];
  loadingFlag:boolean  = null;
  ngOnInit(): void {
    //Make a get request to server to fetch all donee objects with pending registration.

    this.loadingFlag = true;
    this.adminService.viewNgoRegReqs().subscribe((data)=>{
      if(data['ngoList'].length!=0){
      for(var index in data['ngoList']){
        this.ngoRegRequests.push(new DoneeApproveReq(data['ngoList'][index]['ngoId'],data['ngoList'][index]['name'],data['ngoList'][index]['email'],
        data['ngoList'][index]['phone'],data['ngoList'][index]['pan'],data['ngoList'][index]['address'],data['ngoList'][index]['pincode']));
      }
    }
    else{
      console.log("empty ngo list, hide table");
    }

      this.loadingFlag = false;
    })

    
  }
  approveRequest(index:number){
    console.log(index);
    
    this.adminService.approveNgo(this.ngoRegRequests[index].id).subscribe((data)=>{
      console.log(data)
      this.ngoRegRequests.splice(index,1);
    }
    );
  }
  rejectRequest(index:number){
    console.log(index);
    this.adminService.rejectNgo(this.ngoRegRequests[index].id).subscribe((data)=>{
      console.log(data);
      this.ngoRegRequests.splice(index,1);
    });
  }

}
