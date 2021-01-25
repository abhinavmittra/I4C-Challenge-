import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Donee } from '../model/donee';
import { Donor } from '../model/donor';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userId:string=null;

  constructor(private httpClient: HttpClient) { }
  public loginUrl = "http://127.0.0.1:5000/authenticate";
  public registerDonorUrl = "http://127.0.0.1:5000/createUserAccount";
  public registerDoneeUrl = "http://127.0.0.1:5000/createNgoAccount";
  public httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json; charset=utf-8'
    
       }); 
   
  public headerOptions = {
    headers: this.httpHeaders
       };    
  registerDonor(donor:Donor){

    return this.httpClient.post<any>(this.registerDonorUrl,{"Address":donor.address,"Phone":donor.phone,
    "Email":donor.email,"PasswordHash":donor.password,"UserType":"donor","Pincode":donor.pincode,"Name":donor.name},this.headerOptions);

  }
  registerDonee(donee:Donee){
    return this.httpClient.post<any>(this.registerDoneeUrl,{"NGOName":donee.name,"Website":donee.website,"PAN":donee.panno,"Address":donee.address,"website":donee.website,
  "Phone":donee.phone,"Email":donee.email,"Pincode":donee.pincode,"PasswordHash":donee.password,"UserType":"NGO"},this.headerOptions);
  }
  loginUser(email:string,pass:string){
    return this.httpClient.post<any>(this.loginUrl,{"email":email,"password":pass},this.headerOptions);
  }


  setUserId(id:string){
    this.userId = id;
  }
  getUserId(){
    return this.userId;
  }
}
