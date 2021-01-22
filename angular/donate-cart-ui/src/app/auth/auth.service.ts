import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Donee } from '../model/donee';
import { Donor } from '../model/donor';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }
  public loginUrl = "login-endpoint";
  public registerDonorUrl = "register-donor-endpoint";
  public registerDoneeUrl = "register-donee-endpoint";
  public httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json; charset=utf-8'
    
       }); 
   
  public headerOptions = {
    headers: this.httpHeaders
       };    
  registerDonor(donor:Donor){
    return this.httpClient.post<any>(this.registerDonorUrl,JSON.stringify(donor),this.headerOptions);

  }
  registerDonee(donee:Donee){
    return this.httpClient.post<any>(this.registerDoneeUrl,JSON.stringify(donee),this.headerOptions);
  }
  loginUser(email:string,pass:string){
    return this.httpClient.post<any>(this.loginUrl,JSON.stringify({email,pass}),this.headerOptions);
  }
}
