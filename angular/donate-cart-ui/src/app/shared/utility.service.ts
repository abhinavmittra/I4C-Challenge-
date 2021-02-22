import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { CategoryInfo } from '../model/category-info';
import { Subject } from 'rxjs';
import {tap} from 'rxjs/operators'
import {UserNotification} from 'src/app/model/user-notification'
@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private httpClient:HttpClient) { }
  public httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json; charset=utf-8'
    
       }); 
   
  public headerOptions = {
    headers: this.httpHeaders
       };    
  public getImageTestUrl = "http://127.0.0.1:5000/getImage"
  public getCategoriesUrl = "http://127.0.0.1:5000/getCategories"
  public getAlertsUrl = "http://127.0.0.1:5000/getAlerts"
  public rateUserUrl = "http://127.0.0.1:5000/rateUser"
  categoryInfoList:CategoryInfo[];
  categoryInfoListChanged = new Subject<CategoryInfo[]>();
  userNotifications:UserNotification[]=[];
  userNotificationChanged = new Subject<UserNotification[]>();
getUserNotifications(){
  return this.userNotifications.slice()
}
setUserNotifications(data:UserNotification[]){
  this.userNotifications=data;
  this.userNotifications=this.userNotifications.reverse() //desc order of date
  console.log(this.userNotifications)
  this.userNotificationChanged.next(this.userNotifications.slice())
  
}

  getCategoryInfo(){
    return this.categoryInfoList.slice()
  }
  setCategoryInfo(data:CategoryInfo[]){
    this.categoryInfoList = data;
    this.categoryInfoListChanged.next(this.categoryInfoList.slice())
  }


  getImageFromServer(imageId:string){
    return this.httpClient.post<any>(this.getImageTestUrl,{"imageId":imageId},this.headerOptions)
  }
  getCategoriesFromServer(){
    return this.httpClient.get(this.getCategoriesUrl).pipe(tap((data)=>{
      
     this.setCategoryInfo(data["categoryList"]);
      
    }))
  }

  getAlertsFromServer(id:string){
    return this.httpClient.post<any>(this.getAlertsUrl,JSON.stringify({"userId":id}),this.headerOptions).pipe(tap((data)=>{
      this.setUserNotifications(data['alerts'])
    }));
  }

  rateUser(userId:string,rating:string){
    return this.httpClient.post<any>(this.rateUserUrl,JSON.stringify({"userId":userId,"rating":rating}),this.headerOptions)
  }
}
