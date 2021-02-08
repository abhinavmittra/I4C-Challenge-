import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'donate-cart-ui';
  userName:string = "";
  userNameChangedSubscription:Subscription;
  showLogOut:boolean=false;
  showLogOutSubscription:Subscription;
  constructor(private authService:AuthService,private router:Router){}
  ngOnInit(){
   this.showLogOutSubscription = this.authService.showLogout.subscribe((data:boolean)=>{
    this.showLogOut = data;
    })
    this.userNameChangedSubscription = this.authService.userNameChanged.subscribe((name:string)=>{
      this.userName=name;
    })
    
  }
  routeToLogin(){
    this.router.navigate(['/login'])
    this.authService.showLogout.next(false)
  }
  ngOnDestroy(){
      this.showLogOutSubscription.unsubscribe();
      this.userNameChangedSubscription.unsubscribe();
  }
}
