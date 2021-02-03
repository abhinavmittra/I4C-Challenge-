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
