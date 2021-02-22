import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DonorUpdate } from 'src/app/model/donor-update';
import { UserNotification } from 'src/app/model/user-notification';
import { UtilityService } from 'src/app/shared/utility.service';
import { DonorService } from '../../donor.service';

@Component({
  selector: 'app-donor-view-notifications',
  templateUrl: './donor-view-notifications.component.html',
  styleUrls: ['./donor-view-notifications.component.css']
})
export class DonorViewNotificationsComponent implements OnInit {
  userNotifications:UserNotification[]=[]
  userNotificationsChangedSub:Subscription;
  ratingMode:boolean=false;
  ratingValues:number[]=[1,2,3,4,5];
  ratingProvided:string;
  userComments:string=""
  itemId:string=""
  reqId:string=""
  ngoName:string="" //display which ngo user is rating
  constructor(private donorService:DonorService,private utilityService:UtilityService,private authService:AuthService) { }

  ngOnInit(): void {
    this.getUserNotifications()
    this.userNotificationsChangedSub = this.utilityService.userNotificationChanged.subscribe((data:UserNotification[])=>{
      this.userNotifications = data;
     
    })
  }
 

    
    getUserNotifications(){
      this.userNotifications=this.utilityService.getUserNotifications()
     
    }

    performAction(i:number){
      if(this.userNotifications[i].action=='rate'){
        this.ratingMode=true;
        this.itemId = this.userNotifications[i].requirementId;


        
        var updates:DonorUpdate[];
        updates = this.donorService.getDonorUpdates()
        for(var i = 0;i<updates.length;i++){
          if(updates[i].itemId==this.itemId){
            for(var j=0;j<updates[i].itemUpdates.length;j++){
              if(updates[i].itemUpdates[j]["reqId"]==this.reqId){
                this.ngoName = updates[i].itemUpdates[j]["ngoName"]
              }
            }
          }
        }
      }
    }
    rateUser(){
      console.log(this.ratingProvided)
      console.log(this.userComments)


      //this.utilityService.rateUser(this.ngoId,rating)
    }
    showNotifications(){
      this.ratingMode = false;
      this.ratingProvided=""
      this.userComments=""
    }
    ngOnDestroy(){
      this.userNotificationsChangedSub.unsubscribe()
    }
}
