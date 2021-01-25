import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {DonationItem} from '../model/donation-item';

@Injectable({
  providedIn: 'root'
})
export class DonorService {

  public httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json; charset=utf-8'
    
       }); 
   
  public headerOptions = {
    headers: this.httpHeaders
       };    


  public viewItemReqsUrl = "endpoint";
  public donateItemUrl = "endpoint"
  public createDonationItemUrl = "endpoint";
  public viewItemUpdatesUrl = "endpoint";
  

  constructor(private httpClient:HttpClient) { }


  public getItemRequests(){
    return this.httpClient.get(this.viewItemReqsUrl);
  }
  public donateItem(){
    return this.httpClient.post<any>(this.donateItemUrl,{"type":"donate-requirement"});
  }
  public createDonationItem(item:DonationItem){
    return this.httpClient.post<any>(this.createDonationItemUrl,JSON.stringify(item));
  }
  public viewItemUpdates(){
    return this.httpClient.get(this.viewItemUpdatesUrl)
  }
}
