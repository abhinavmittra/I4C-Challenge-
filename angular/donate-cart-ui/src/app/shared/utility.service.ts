import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { CategoryInfo } from '../model/category-info';
import { Subject } from 'rxjs';
import {tap} from 'rxjs/operators'
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

  categoryInfoList:CategoryInfo[];
  categoryInfoListChanged = new Subject<CategoryInfo[]>();

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
}
