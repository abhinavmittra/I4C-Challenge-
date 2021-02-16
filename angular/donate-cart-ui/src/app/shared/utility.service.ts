import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
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

  getImageFromServer(imageId:string){
    return this.httpClient.post<any>(this.getImageTestUrl,{"imageId":imageId},this.headerOptions)
  }
}
