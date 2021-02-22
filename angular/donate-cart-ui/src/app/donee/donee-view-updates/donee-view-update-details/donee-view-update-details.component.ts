import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoneeUpdate } from 'src/app/model/donee-update';
import { RequirementUpdate } from 'src/app/model/requirement-update';
import { UtilityService } from 'src/app/shared/utility.service';
import { DoneeService } from '../../donee.service';

@Component({
  selector: 'app-donee-view-update-details',
  templateUrl: './donee-view-update-details.component.html',
  styleUrls: ['./donee-view-update-details.component.css']
})
export class DoneeViewUpdateDetailsComponent implements OnInit {
  selectedReqUpdates:RequirementUpdate[]=[];
  update:any;
  msgMode :boolean = false;
  messageBody:string = "";
  imgMode:boolean=false;
  imageLoaded:boolean=false;
  imageString:string=""
  selectedImage:File=null;
  updateIdx:number = null;
  
  constructor(private router:Router,private route:ActivatedRoute,private doneeService:DoneeService,private utilityService:UtilityService) { }

  ngOnInit(): void {
    this.viewReqUpdates()
  }


  viewReqUpdates(){
    const itemIndex = +this.route.snapshot.paramMap.get('id')-1
    this.update= this.doneeService.getDoneeUpdate(itemIndex);
  
    for(var i  = 0;i<this.update.reqUpdates.length;i++){
      //console.log(this.donorUpdates[index].itemUpdates[i]["updateType"])
      const updateType = this.update.reqUpdates[i]["updateType"]
      const itemId = this.update.reqUpdates[i]["itemId"]
      const reqId = this.update.reqUpdates[i]["reqId"]
      const ngoId = this.update.reqUpdates[i]["ngoId"]
      const donorId = this.update.reqUpdates[i]["donorId"]
      

      //perform checks for optional fields
      var msg = "";
      var msgFrom = "";
      var ngoName = "";
      var itemQuality = ""
      var itemQuantity = "";
      var itemDetails = ""
      var itemImageLink = ""        
      var updateDate=""
      var pincode = ""
      var messageImage = "-1"
      if(this.update.reqUpdates[i]["message"])
        msg = this.update.reqUpdates[i]["message"];
      if(this.update.reqUpdates[i]["messageFrom"])
        msgFrom = this.update.reqUpdates[i]["messageFrom"];
      if(this.update.reqUpdates[i]["ngoName"])
        ngoName = this.update.reqUpdates[i]["ngoName"];
      if(this.update.reqUpdates[i]["itemQuantity"])
        itemQuantity = this.update.reqUpdates[i]["itemQuantity"];
      if(this.update.reqUpdates[i]["itemDetails"])
        itemDetails = this.update.reqUpdates[i]["itemDetails"];
      if( this.update.reqUpdates[i]["updateDate"]) 
        updateDate = this.update.reqUpdates[i]["updateDate"]
      if( this.update.reqUpdates[i]["itemImageLink"]) 
        itemImageLink = this.update.reqUpdates[i]["itemImageLink"]
       if( this.update.reqUpdates[i]["itemQuality"]) 
        itemQuality = this.update.reqUpdates[i]["itemQuality"]
      if( this.update.reqUpdates[i]["pincode"]) 
        pincode = this.update.reqUpdates[i]["pincode"]
      messageImage = this.update.reqUpdates[i]["imageLink"]
    
      this.selectedReqUpdates.push(new RequirementUpdate(updateType,itemId,reqId,ngoId,donorId,pincode,ngoName,itemQuantity,itemQuality,itemImageLink,itemDetails,msgFrom,msg,updateDate,messageImage));
      
    }
    
}

  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
  }

  viewImage(updateIndex:number,serviceType:string){
    this.imageString="";
  this.imgMode=true;

  if(serviceType=='message'){
  this.utilityService.getImageFromServer(this.selectedReqUpdates[updateIndex].messageImage).subscribe((data)=>{
    if(data["image"]!="-1"){
    this.imageString = "data:image/jpeg;base64,"+data["image"]
    this.imageLoaded=true;
    }
    else{
      this.imageString=="-1";
      this.imageLoaded=false;
    }
  })
  }

else if(serviceType=='item'){

  this.utilityService.getImageFromServer(this.selectedReqUpdates[updateIndex].itemImageLink).subscribe((data)=>{
    if(data["image"]!="-1"){
    this.imageString = "data:image/jpeg;base64,"+data["image"]
    this.imageLoaded=true;
    }
    else{
      this.imageString=="-1";
      this.imageLoaded=false;
    }
  })
}
}

  
  showUpdates(){
    this.msgMode = false;
    this.imgMode = false;
    this.imageLoaded = false;
  }
  setMsgIndex(updateIdx:number){
    
    this.updateIdx = updateIdx;
   this.msgMode = true;
    this.messageBody ="";
    
  }
  sendMessage(){
  
  
    const itemIndex = +this.route.snapshot.paramMap.get('id')-1
    const message = this.messageBody
    var submitForm = new FormData()
    submitForm.append("requirementId",this.selectedReqUpdates[this.updateIdx].requirementId)
    submitForm.append("itemId",this.selectedReqUpdates[this.updateIdx].itemId)
    submitForm.append("message",message)
    submitForm.append("donorId",this.selectedReqUpdates[this.updateIdx].donorId)
    submitForm.append("ngoId",this.selectedReqUpdates[this.updateIdx].ngoId)
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
      "reqId":this.selectedReqUpdates[this.updateIdx].requirementId,
      "itemId":this.selectedReqUpdates[this.updateIdx].itemId,
      "ngoId":this.selectedReqUpdates[this.updateIdx].ngoId,
      "ngoName":this.selectedReqUpdates[this.updateIdx].ngoName,
      "donorId":this.selectedReqUpdates[this.updateIdx].donorId,
      "message":message,
      "messageFrom":"NGO",
      "updateDate":new Date().toISOString(),
      "imageLink":data["imageId"]
  }

//update donorUpdate copy on Server
  updates[itemIndex].reqUpdates.push(itemUpdates)
  this.doneeService.setDoneeUpdates(updates)

  //update local copy 
  this.selectedReqUpdates.push(new RequirementUpdate("message",this.selectedReqUpdates[this.updateIdx].itemId,
  this.selectedReqUpdates[this.updateIdx].requirementId,this.selectedReqUpdates[this.updateIdx].ngoId,
  this.selectedReqUpdates[this.updateIdx].donorId,this.selectedReqUpdates[this.updateIdx].pincode,
  this.selectedReqUpdates[this.updateIdx].ngoName,
  "",
  "",
  this.selectedReqUpdates[this.updateIdx].itemImageLink,
  this.selectedReqUpdates[this.updateIdx].itemDetails,
  "NGO",message,new Date().toISOString(),data["imageId"]));
  
  
  this.msgMode = false;
    });  
    
    
  }



  markReceived(updateIdx:number){
    //check if received update already exists for itemId, if not then mark received otherwise 
    
    var receivedFlag = false;
    const itemId = this.selectedReqUpdates[updateIdx].itemId
    for(var i =0;i<this.selectedReqUpdates.length;i++){
      if(this.selectedReqUpdates[i].updateType=="received"&&itemId==this.selectedReqUpdates[i].itemId){
        receivedFlag = true;
        alert("Already received")
       
      }
    }
  


    if(!receivedFlag){

      var updates:DoneeUpdate[];
      //get local copy of updates
      updates =  this.doneeService.getDoneeUpdates();
      var reqUpdates = {};
      reqUpdates = {
        "updateType":"received",
        "reqId":this.selectedReqUpdates[updateIdx].requirementId,
        "itemId":this.selectedReqUpdates[updateIdx].itemId,
        "ngoId":this.selectedReqUpdates[updateIdx].ngoId,
        "donorId":this.selectedReqUpdates[updateIdx].donorId,
        "updateDate":new Date().toISOString()
    }
    
    updates[itemId].reqUpdates.push(reqUpdates)
  //update copy in service
    this.doneeService.setDoneeUpdates(updates)


    //update local copy
    this.selectedReqUpdates.push(new RequirementUpdate("received",this.selectedReqUpdates[this.updateIdx].itemId,
  this.selectedReqUpdates[this.updateIdx].requirementId,this.selectedReqUpdates[this.updateIdx].ngoId,
  this.selectedReqUpdates[this.updateIdx].donorId,this.selectedReqUpdates[this.updateIdx].pincode,
  this.selectedReqUpdates[this.updateIdx].ngoName,
  "",
  "",
  this.selectedReqUpdates[this.updateIdx].itemImageLink,
  this.selectedReqUpdates[this.updateIdx].itemDetails,
  "NGO","-1",new Date().toISOString(),"-1"));

    //Call API
    this.doneeService.markReceived(this.selectedReqUpdates[updateIdx].requirementId,
      this.selectedReqUpdates[updateIdx].itemId,
      this.selectedReqUpdates[updateIdx].donorId,
      this.selectedReqUpdates[updateIdx].ngoId).subscribe((data)=>{
     console.log(data)
    })
  }
  }




  acceptOrReject(updateIdx:number,actionTaken:string){
    const itemIndex = +this.route.snapshot.paramMap.get('id')-1
    //validate first if it has been accepted or rejected'
    
    var actionPerformed = false;
    const itemId = this.selectedReqUpdates[updateIdx].itemId;
    for(var i =0;i<this.selectedReqUpdates.length;i++){
      if((this.selectedReqUpdates[updateIdx].updateType=="acceptDonation"||this.selectedReqUpdates[updateIdx].updateType=="declineDonation")&&itemId==this.selectedReqUpdates[updateIdx].itemId){
        actionPerformed= true;
        alert("You have already accepted or declined this item")
        
      }
    }


    if(!actionPerformed){
      //Add Updates to local copy
      var updates:DoneeUpdate[];
      var quantity = this.selectedReqUpdates[updateIdx].itemQuantity
      updates =  this.doneeService.getDoneeUpdates();
      var reqUpdates = {};
      if(actionTaken=="accept"){
     reqUpdates = {
      "updateType":"acceptDonation",
      "reqId":this.selectedReqUpdates[updateIdx].requirementId,
      "itemId":this.selectedReqUpdates[updateIdx].itemId,
      "ngoId":this.selectedReqUpdates[updateIdx].ngoId,
      "donorId":this.selectedReqUpdates[updateIdx].donorId,
      "updateDate":new Date().toISOString()
  }
}
  else if(actionTaken=="decline"){
     reqUpdates = {
      "updateType":"declineDonation",
      "reqId":this.selectedReqUpdates[updateIdx].requirementId,
      "itemId":this.selectedReqUpdates[updateIdx].itemId,
      "ngoId":this.selectedReqUpdates[updateIdx].ngoId,
      "donorId":this.selectedReqUpdates[updateIdx].donorId,
      "updateDate":new Date().toISOString()
  }
  }
    updates[itemIndex].reqUpdates.push(reqUpdates)
    
    this.doneeService.setDoneeUpdates(updates);

    this.doneeService.acceptOrReject(
      this.selectedReqUpdates[updateIdx].requirementId,
      this.selectedReqUpdates[updateIdx].itemId,
      this.selectedReqUpdates[updateIdx].donorId,
      this.selectedReqUpdates[updateIdx].ngoId,
    actionTaken,quantity).subscribe((data)=>{
     console.log(data)
    });
  }
}

routeToUpdates(){
  this.doneeService.currentPageChanged.next("updates");
  this.router.navigate(['/donee/updates/list'])
}

  
  

}
