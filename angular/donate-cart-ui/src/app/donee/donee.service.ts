import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {SubmitRequirement} from '../model/submit-requirement';
import { DonationItem } from '../model/donation-item';
import { Subject } from 'rxjs';
import {tap} from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
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

public httpHeadersForm = new HttpHeaders({
  'Content-Type': 'multipart/form-data'
})
public options = {
  headers:this.httpHeadersForm
}

  public viewItemDonationsUrl = "http://127.0.0.1:5000/getItems";
  public requestItemUrl = "http://127.0.0.1:5000/requestItem";
  public createItemRequirementItemUrl = "http://127.0.0.1:5000/createPublicRequirement";
  public viewItemUpdatesUrl = "endpoint";


  publicItemsList:DonationItem[]=[];
  publicItemsChanged = new Subject<DonationItem[]>();

  setPublicItems(data:any){
    this.publicItemsList = data['donationItems']
    this.publicItemsChanged.next(this.publicItemsList.slice());
  }
  getPublicItems(){
    return this.publicItemsList.slice();
  }

  getItem(index:number){
    return this.publicItemsList[index];
  }

  constructor(private httpClient:HttpClient,private authService:AuthService) { }

  requestItem(form:FormData){
   
    
    return this.httpClient.post<any>(this.requestItemUrl,form);
  }

  getAvailableDonationsFromServer(){
    return this.httpClient.get(this.viewItemDonationsUrl).pipe(tap((data)=>{
      this.setPublicItems(data);
    }));
  }
  getUpdates(ngoId:string){
    return this.httpClient.post(this.viewItemUpdatesUrl,{ngoId});
  }
  createItemRequirement(item:SubmitRequirement){
    return this.httpClient.post<any>(this.createItemRequirementItemUrl,JSON.stringify(item),this.headerOptions);
  }
}
