import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {SubmitRequirement} from '../model/submit-requirement';
import { DonationItem } from '../model/donation-item';
import { Subject } from 'rxjs';
import {tap} from 'rxjs/operators';
import {DoneeUpdate} from '../model/donee-update';

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


  publicItemsList:DonationItem[]=[];
  publicItemsChanged = new Subject<DonationItem[]>();
  doneeUpdates:DoneeUpdate[]=[]
  doneeUpdatesChanged = new Subject<DoneeUpdate[]>();
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
  setDoneeUpdates(data:any){
    var refList = []
   for(var itemIndex in data['updatesForDonor']){
      var idx = +itemIndex + 1
      var key = "Item"+idx

      var id = data['updatesForDonor'][itemIndex][key]['itemId']
      var name = data['updatesForDonor'][itemIndex][key]['itemName']
      var cat = data['updatesForDonor'][itemIndex][key]['itemCategory']
      var subcat = data['updatesForDonor'][itemIndex][key]['itemSubcategory']
      var quantity = data['updatesForDonor'][itemIndex][key]['itemQuantity']
      var quality = data['updatesForDonor'][itemIndex][key]['itemQuality']
      var details = data['updatesForDonor'][itemIndex][key]['itemDetails']
      var itemUpdates = data['updatesForDonor'][itemIndex][key]['itemUpdates']
      //var date = data['updatesForDonor'][itemIndex][key]['itemDate']
      //var imgLink = data['updatesForDonor'][itemIndex][key]['itemImageLink']
      var imgLink=''
      var date = new Date()
      refList.push(new DonorUpdate(id,name,cat,subcat,quantity,quality,details,imgLink,date.toDateString(),itemUpdates))
    

   }
    this.donorUpdates = refList
    
    this.donorUpdatesChanged.next(this.donorUpdates.slice());

    
  }
  constructor(private httpClient:HttpClient) { }

  requestItem(form:FormData){
   
    
    return this.httpClient.post<any>(this.requestItemUrl,form);
  }

  getAvailableDonationsFromServer(){
    return this.httpClient.get(this.viewItemDonationsUrl).pipe(tap((data)=>{
      this.setPublicItems(data);
    }));
  }
  getDoneeUpdatesFromServer(ngoId:string){
    return this.httpClient.post<any>(this.viewItemUpdatesUrl,{"ngoId":ngoId},this.headerOptions).pipe(tap((data)=>{
      this.setDoneeUpdates(data);
    }));
  }
  createItemRequirement(item:SubmitRequirement){
    return this.httpClient.post<any>(this.createItemRequirementItemUrl,JSON.stringify(item),this.headerOptions);
  }

  
}
