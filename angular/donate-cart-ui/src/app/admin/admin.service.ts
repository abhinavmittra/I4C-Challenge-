import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  public getNgoRegReqsUrl = "replace with endpoint here";
  public adminActionForRegUrl = "http://127.0.0.1:5000/endpoint"
  public httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json; charset=utf-8'
    
       }); 
   
  public headerOptions = {
    headers: this.httpHeaders
       };    
  constructor(private httpClient: HttpClient) { }

  approveNgo(){
    return this.httpClient.post<any>(this.adminActionForRegUrl,{"action":"accept"});
  }
  rejectNgo(){
    return this.httpClient.post<any>(this.adminActionForRegUrl,{"action":"reject"});
  }

  viewNgoRegReqs(){
    return this.httpClient.get(this.getNgoRegReqsUrl);
  }


}
