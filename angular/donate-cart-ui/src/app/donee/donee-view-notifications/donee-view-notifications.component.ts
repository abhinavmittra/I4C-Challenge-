import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DoneeUpdate } from 'src/app/model/donee-update';
import { UserNotification } from 'src/app/model/user-notification';
import { UtilityService } from 'src/app/shared/utility.service';
import { DoneeService } from '../donee.service';

@Component({
  selector: 'app-donee-view-notifications',
  templateUrl: './donee-view-notifications.component.html',
  styleUrls: ['./donee-view-notifications.component.css']
})
export class DoneeViewNotificationsComponent implements OnInit {
  userNotifications:UserNotification[]=[]
  userNotificationsChangedSub:Subscription;
  msgMode:boolean=false;
  messageBody:string="";
  selectedImage:File=null;
  reqId:string=""
  donorId:string=""
  itemId:string=""
  constructor(private authService:AuthService,private utilityService:UtilityService,private doneeService:DoneeService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserNotifications()
    this.userNotificationsChangedSub = this.utilityService.userNotificationChanged.subscribe((data:UserNotification[])=>{
      this.userNotifications = data;
     
    })
  }

  getUserNotifications(){
    this.userNotifications=this.utilityService.getUserNotifications()
   
  }
  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
  }
  performAction(index:number){
    if(this.userNotifications[index].action=='message'){
      this.reqId = this.userNotifications[index].linkedToId;
      //assign itemId,ngoId & donorId as well
      this.msgMode=true;
    }
  }
  sendMessage(){
    var reqIndex = -1;
    var doneeUpdates:DoneeUpdate[];
    doneeUpdates = this.doneeService.getDoneeUpdates();
    for(var i=0;i<doneeUpdates.length;i++){
      if(doneeUpdates[i].reqId==this.reqId){
        reqIndex = i;
        break;
      }
    }

    const message = this.messageBody
    var submitForm = new FormData()
    submitForm.append("requirementId",this.reqId)
    submitForm.append("itemId",this.itemId)
    submitForm.append("message",message)
    submitForm.append("donorId",this.donorId)
    submitForm.append("ngoId",this.authService.getUserId())
    if(this.selectedImage!=null)
    submitForm.append("image",this.selectedImage)
  //Call API
    this.doneeService.sendMessageToDonor(submitForm).subscribe((data)=>{
     
  var updates:DoneeUpdate[];
    //get local copy of updates
        updates =  this.doneeService.getDoneeUpdates();
        var itemUpdates = {};
    itemUpdates = {
      "updateType":"message",
      "reqId":this.reqId,
      "itemId":this.itemId,
      "ngoId":this.authService.getUserId(),
      "ngoName":this.authService.getName(),
      "donorId":this.donorId,
      "message":message,
      "messageFrom":"NGO",
      "updateDate":new Date().toISOString(),
      "imageLink":data["imageId"]
  }

  //update donorUpdate copy on Server
    updates[reqIndex].reqUpdates.push(itemUpdates)
    this.doneeService.setDoneeUpdates(updates)
    }
    )



    this.router.navigate(['updates/detail/'+(reqIndex+1)],{relativeTo:this.route})
  }
  showNotifications(){
    this.msgMode=false;
    this.selectedImage=null;
  }
  ngOnDestroy(){
    this.userNotificationsChangedSub.unsubscribe()
  }

}
