import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {SubmitRequirement} from '../model/submit-requirement';
import { DonationItem } from '../model/donation-item';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import {tap} from 'rxjs/operators';
import {DoneeUpdate} from '../model/donee-update';
import { ngModuleJitUrl } from '@angular/compiler';

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
  public viewItemUpdatesUrl = "http://127.0.0.1:5000/getUpdatesForNGO";
  public sendMessageUrl = "http://127.0.0.1:5000/sendMessageToDonor"
  public markReceivedUrl = "http://127.0.0.1:5000/markItem"
  public deleteRequirementUrl = "http://127.0.0.1:5000/deleteRequirement"
  public acceptOrRejectUrl = "http://127.0.0.1:5000/accept_decline_donation"
  
  publicItemsList:DonationItem[]=[];
  publicItemsChanged = new Subject<DonationItem[]>();
  doneeUpdates:DoneeUpdate[]=[]
  doneeUpdatesChanged = new Subject<DoneeUpdate[]>();

  currentPage:string = "donations";
  currentPageChanged = new BehaviorSubject<string>("donations");

  getCurrentPage(){
    return this.currentPage;
  }
  setCurrentPage(currentPage:string){
    this.currentPage=currentPage;
    this.currentPageChanged.next(this.currentPage);
  }



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
  getDoneeUpdates(){
   return this.doneeUpdates.slice();
  }
  setDoneeUpdates(data:DoneeUpdate[]){
    
    this.doneeUpdates = data;
    this.doneeUpdatesChanged.next(this.doneeUpdates.slice());
    
  }
  constructor(private httpClient:HttpClient) { }

  requestItem(form:FormData){
   
    
    return this.httpClient.post<any>(this.requestItemUrl,form);
  }

  getAvailableDonationsFromServer(ngoId:string){
    return this.httpClient.post<any>(this.viewItemDonationsUrl,JSON.stringify({"ngoId":ngoId})).pipe(tap((data)=>{
      this.setPublicItems(data);
    }));
  }
  getDoneeUpdatesFromServer(ngoId:string){
    return this.httpClient.post<any>(this.viewItemUpdatesUrl,{"ngoId":ngoId},this.headerOptions).pipe(tap((data)=>{
      var refList = []
   for(var itemIndex in data['updatesForNGO']){
      var idx = +itemIndex + 1
      var key = "Requirement"+idx

      var id = data['updatesForNGO'][itemIndex][key]['reqId']
      var name = data['updatesForNGO'][itemIndex][key]['reqName']
      var cat = data['updatesForNGO'][itemIndex][key]['reqCategory']
      var subcat = data['updatesForNGO'][itemIndex][key]['reqSubcategory']
      var quantity = data['updatesForNGO'][itemIndex][key]['reqQuantity']
      var details = data['updatesForNGO'][itemIndex][key]['reqDetails']
      var reqUpdates = data['updatesForNGO'][itemIndex][key]['reqUpdates']
      var reqDate = data['updatesForNGO'][itemIndex][key]['reqDate']
      
      refList.push(new DoneeUpdate(id,name,cat,subcat,quantity,details,reqDate,reqUpdates))
    

   }
    this.doneeUpdates = refList
    
    this.doneeUpdatesChanged.next(this.doneeUpdates.slice());
    }));
  }
  createItemRequirement(item:SubmitRequirement){
    return this.httpClient.post<any>(this.createItemRequirementItemUrl,JSON.stringify(item),this.headerOptions);
  }

  sendMessageToDonor(reqId:string,itemId:string,donorId:string,ngoId:string,message:string){
    return this.httpClient.post<any>(this.sendMessageUrl,JSON.stringify({
      'requirementId':reqId,
    'itemId':itemId,
    'ngoId':ngoId,
    'donorId':donorId,
    'message':message
  
  }),this.headerOptions);
  }


  markReceived(reqId:string,itemId:string,donorId:string,ngoId:string){
    return this.httpClient.post<any>(this.markReceivedUrl,JSON.stringify({
    'requirementId':reqId,
    'itemId':itemId,
    'ngoId':ngoId,
    'donorId':donorId
  
  }),this.headerOptions);
  }

  deleteRequirement(reqId:string,ngoId:string){
    return this.httpClient.post<any>(this.deleteRequirementUrl,JSON.stringify({
      'requirementId':reqId,
      'ngoId':ngoId,
     
    
    }),this.headerOptions);
  }


  acceptOrReject(reqId:string,itemId:string,donorId:string,ngoId:string,actionTaken:string){
    return this.httpClient.post<any>(this.acceptOrRejectUrl,JSON.stringify({
      'requirementId':reqId,
      'itemId':itemId,
      'ngoId':ngoId,
      'donorId':donorId,
      'actionTaken':actionTaken
    
    }),this.headerOptions);
  }
  
}
