import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {DonationItem} from '../model/donation-item';
@Injectable({
  providedIn: 'root'
})
export class DoneeService {
  public httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json; charset=utf-8'
    
       }); 
   
  public headerOptions = {
    headers: this.httpHeaders
       };    


  public viewItemDonationsUrl = "endpoint";
  public requestItemUrl = "endpoint"
  public createItemRequirementItemUrl = "endpoint";
  public viewItemUpdatesUrl = "endpoint";
  constructor(private httpClient:HttpClient) { }

  requestItem(index:number){
    //send post req which contains Id of the ItemRequirement
    
    return this.httpClient.get(this.requestItemUrl);
  }

  getAvailableDonations(){
    return this.httpClient.get(this.viewItemDonationsUrl);
  }
  getUpdates(ngoId:string){
    return this.httpClient.post(this.viewItemUpdatesUrl,{ngoId});
  }
  createItemRequirement(item:DonationItem){
    return this.httpClient.post<any>(this.createItemRequirementItemUrl,JSON.stringify(item));
  }
}
