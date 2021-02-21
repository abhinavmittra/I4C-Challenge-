import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserNotification } from 'src/app/model/user-notification';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-donor-view-notifications',
  templateUrl: './donor-view-notifications.component.html',
  styleUrls: ['./donor-view-notifications.component.css']
})
export class DonorViewNotificationsComponent implements OnInit {
  userNotifications:UserNotification[]=[]
  userNotificationsChangedSub:Subscription;
  constructor(private utilityService:UtilityService) { }

  ngOnInit(): void {
    this.getUserNotifications()
    this.userNotificationsChangedSub = this.utilityService.userNotificationChanged.subscribe((data:UserNotification[])=>{
      this.userNotifications = data;
     
    })
  }

    
    getUserNotifications(){
      this.userNotifications=this.utilityService.getUserNotifications()
     
    }

    performAction(){
      
    }

    ngOnDestroy(){
      this.userNotificationsChangedSub.unsubscribe()
    }
}
