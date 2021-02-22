import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/utility.service';
import { DoneeApproveReq} from '../../model/donee-approve-req';
import {AdminService} from '../admin.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private adminService:AdminService,private utilityService:UtilityService) { }
  public ngoRegRequests : DoneeApproveReq[] = [];
  loadingFlag:boolean  = null;
  imgMode:boolean=false;
  imageString:string="";
  imageLoaded:boolean=false;

  ngOnInit(): void {
    //Make a get request to server to fetch all donee objects with pending registration.

    this.loadingFlag = true;
    this.adminService.viewNgoRegReqs().subscribe((data)=>{
      if(data['ngoList'].length!=0){
      for(var index in data['ngoList']){
        
        this.ngoRegRequests.push(new DoneeApproveReq(data['ngoList'][index]['ngoId'],data['ngoList'][index]['name'],data['ngoList'][index]['email'],
        data['ngoList'][index]['phone'],data['ngoList'][index]['pan'],data['ngoList'][index]['address'],data['ngoList'][index]['pincode'],data['ngoList'][index]['imageLink'],data['ngoList'][index]['additionalComments']));
      }
    }

    else{
      this.ngoRegRequests.length=0;//hide table
    }
    
      this.loadingFlag = false;
    })

    
  }
  viewImage(index:number){
    this.imageString="";
    this.imgMode=true;
    console.log(this.ngoRegRequests[index].imageLink)
    this.utilityService.getImageFromServer(this.ngoRegRequests[index].imageLink).subscribe((data)=>{
      if(data["image"]!="-1"){
      this.imageString = "data:image/jpeg;base64,"+data["image"]
      this.imageLoaded=true;
      }
      else{
        this.imageString=="-1";
        this.imageLoaded=false;
      }
      console.log(this.imageString)
    })
  }


  showRequests(){
    this.imgMode=false;
    this.imageLoaded=false;
  }
  approveRequest(index:number){
   
    
    this.adminService.approveNgo(this.ngoRegRequests[index].id).subscribe((data)=>{
      console.log(data)
      this.ngoRegRequests.splice(index,1);
    }
    );
  }
  rejectRequest(index:number){
    
    this.adminService.rejectNgo(this.ngoRegRequests[index].id).subscribe((data)=>{
      console.log(data);
      this.ngoRegRequests.splice(index,1);
    });
  }

}
