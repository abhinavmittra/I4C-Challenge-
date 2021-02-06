import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Donee } from '../model/donee';
import { Donor } from '../model/donor';
import { BehaviorSubject} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userId:string=null;
  name:string = null;
  email:string = null;
  address:string = null;
  pincode:string = null;
  pan:string = null;
  showLogout = new BehaviorSubject<boolean>(false);
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
    return this.httpClient.post<any>(this.registerDoneeUrl,{"NGOName":donee.name,"Website":donee.website,"PAN":donee.panno,"Address":donee.address,"description":donee.description,
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
  getName(){
    return this.name;
  }
  setName(name:string){
    this.name = name;
  }

  getPincode(){
    return this.pincode;
  }
  setPincode(pin:string){
    this.pincode = pin;
  }
  getAddress(){
    return this.getAddress;
  }
  setAddress(address:string){
    this.address = address;
  }
  getPan(){
    return this.pincode;
  }
  setPan(pan:string){
    this.pan = pan;
  }
  
}
