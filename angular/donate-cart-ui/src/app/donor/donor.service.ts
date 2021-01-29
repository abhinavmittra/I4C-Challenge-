import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemRequirement } from '../model/item-requirement';
import {tap} from 'rxjs/operators'
import {Subject} from 'rxjs'

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

  
  public getRequirementsUrl = "http://127.0.0.1:5000/getRequirements";
  public donateItemUrl = "endpoint"
  public createDonationItemUrl = "endpoint";
  public viewItemUpdatesUrl = "endpoint";
  

  publicItemRequirements:ItemRequirement[]=[];

  constructor(private httpClient:HttpClient) { }

  getItemRequirements(){

    return this.publicItemRequirements.slice();
  }
  setItemRequirements(data:any){
    this.publicItemRequirements = data["itemRequirements"]
    console.log("hi from set req")
    console.log(data["itemRequirements"])
    console.log(this.publicItemRequirements);
  }
  
  
  public getRequirementsFromServer(){
    return this.httpClient.get(this.getRequirementsUrl).pipe(tap((data)=>{
      this.setItemRequirements(data);
    }));;
  }
  public donateItem(){
    return this.httpClient.post<any>(this.donateItemUrl,{"type":"donate-requirement"});
  }
  public createDonationItem(form:FormData){
    return this.httpClient.post<any>(this.createDonationItemUrl,form);
  }
  public viewItemUpdates(donorId:string){
    return this.httpClient.post<any>(this.viewItemUpdatesUrl,{"id":donorId},this.headerOptions);
  }
}
