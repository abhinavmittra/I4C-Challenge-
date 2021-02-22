import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public getNgoRegReqsUrl = "http://127.0.0.1:5000/getUnverifiedNgoList";
  public adminActionForRegUrl = "http://127.0.0.1:5000/approve_reject_NGO"
  public httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json; charset=utf-8'
    
       }); 
   
  public headerOptions = {
    headers: this.httpHeaders
       };    
  constructor(private httpClient: HttpClient) { }

  approveNgo(ngoId:string){
    return this.httpClient.post<any>(this.adminActionForRegUrl,{"actionTaken":"accept","id":ngoId});
  }
  rejectNgo(ngoId:string){
    return this.httpClient.post<any>(this.adminActionForRegUrl,{"actionTaken":"reject","id":ngoId});
  }

  viewNgoRegReqs(){
    return this.httpClient.get(this.getNgoRegReqsUrl);
  }


}
