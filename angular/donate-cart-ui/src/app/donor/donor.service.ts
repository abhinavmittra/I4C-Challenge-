import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemRequirement } from '../model/item-requirement';
import {DonorUpdate} from '../model/donor-update';
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
  public donateItemUrl = "http://127.0.0.1:5000/respondToRequirement";
  public createDonationItemUrl = "http://127.0.0.1:5000/donateItemPublic";
  public viewItemUpdatesUrl = "http://127.0.0.1:5000/getUpdatesForDonor";
  

  publicItemRequirements:ItemRequirement[]=[];
  publicItemRequirementsChanged = new Subject<ItemRequirement[]>();
  
  donorUpdates:DonorUpdate[]=[]
  donorUpdatesChanged = new Subject<DonorUpdate[]>();
  constructor(private httpClient:HttpClient) { }

  
  getDonorUpdates(){
    return this.donorUpdates.slice()
  }
  setDonorUpdates(data:any){
    this.donorUpdates = data['updatesForDonor'];
    this.donorUpdatesChanged.next(this.donorUpdates.slice());
  }


  getItemRequirements(){

    return this.publicItemRequirements.slice();
  }
  setItemRequirements(data:any){
    this.publicItemRequirements = data["itemRequirements"]
    this.publicItemRequirementsChanged.next(this.publicItemRequirements.slice())
    
  }
  getItemRequirement(index:number){
    return this.publicItemRequirements[index];
  }
  
  
  public getRequirementsFromServer(){
    return this.httpClient.get(this.getRequirementsUrl).pipe(tap((data)=>{
      this.setItemRequirements(data);
    }));;
  }
  public donateItem(item:FormData){
    return this.httpClient.post<any>(this.donateItemUrl,item);
  }
  public createDonationItem(form:FormData){
    return this.httpClient.post<any>(this.createDonationItemUrl,form);
  }
  public getDonorUpdatesFromServer(donorId:string){
    return this.httpClient.post<any>(this.viewItemUpdatesUrl,{"donorId":donorId},this.headerOptions).pipe(tap((data)=>{
      this.setDonorUpdates(data);
    }));
  }
}
