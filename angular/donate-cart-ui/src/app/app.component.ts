import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'donate-cart-ui';

  showLogOut:boolean=false;
  showLogOutSubscription:Subscription;
  constructor(private authService:AuthService){}
  ngOnInit(){
   this.showLogOutSubscription = this.authService.showLogout.subscribe((data:boolean)=>{
    this.showLogOut = data;
    })
    
  }
  ngOnDestroy(){
      this,this.showLogOutSubscription.unsubscribe();
  }
}
