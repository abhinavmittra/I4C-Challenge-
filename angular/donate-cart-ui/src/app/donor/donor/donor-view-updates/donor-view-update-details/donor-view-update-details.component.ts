import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from 'src/app/donor/donor.service';
import { DonorUpdate } from 'src/app/model/donor-update';
import { ItemUpdate } from 'src/app/model/item-update';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-donor-view-update-details',
  templateUrl: './donor-view-update-details.component.html',
  styleUrls: ['./donor-view-update-details.component.css']
})
export class DonorViewUpdateDetailsComponent implements OnInit {
  selectedItemUpdates:ItemUpdate[]=[];
  update:any;
  msgMode:boolean = false;
  imgMode:boolean=false;
  imageLoaded:boolean=false;
  imageString:string;
  selectedImage:File=null;
  messageBody:string="";
 
  updateIdx:number=null;
  constructor(private utilityService:UtilityService,private router:Router,private route:ActivatedRoute,private donorService:DonorService) { }

  ngOnInit(): void {
    
   this.viewItemUpdates()
  }


viewItemUpdates(){
  //get index from route and call service to get update list for that particular item
  const itemIndex = +this.route.snapshot.paramMap.get('id')-1
  this.update= this.donorService.getDonorUpdate(itemIndex);

  
  for(var i  = 0;i<this.update.itemUpdates.length;i++){
   
    const updateType = this.update.itemUpdates[i]["updateType"]
    const itemId = this.update.itemUpdates[i]["itemId"]
    const reqId = this.update.itemUpdates[i]["reqId"]
    const ngoId = this.update.itemUpdates[i]["ngoId"]
    const donorId = this.update.itemUpdates[i]["donorId"]
    

    //perform checks for optional fields
    var msg = "";
    var msgFrom = "";
    var ngoName = "";
    var reqQuantity = "";
    var reqDetails = ""
    var updateDate=""
    var messageImage = "-1"

    if(this.update.itemUpdates[i]["message"])
      msg = this.update.itemUpdates[i]["message"];
    if(this.update.itemUpdates[i]["messageFrom"])
      msgFrom =this.update.itemUpdates[i]["messageFrom"];
    if(this.update.itemUpdates[i]["ngoName"])
      ngoName = this.update.itemUpdates[i]["ngoName"];
    if(this.update.itemUpdates[i]["reqQuantity"])
      reqQuantity = this.update.itemUpdates[i]["reqQuantity"];
    if(this.update.itemUpdates[i]["reqDetails"])
      reqDetails = this.update.itemUpdates[i]["reqDetails"];
    if( this.update.itemUpdates[i]["updateDate"]) 
      var tempDate = this.update.itemUpdates[i]["updateDate"]
      var formattedDate = new Date(tempDate)
      updateDate = formattedDate.toLocaleString()
    messageImage = this.update.itemUpdates[i]["imageLink"]
    this.selectedItemUpdates.push(new ItemUpdate(updateType,itemId,reqId,ngoId,donorId,ngoName,reqQuantity,reqDetails,msgFrom,msg,updateDate,messageImage));
  
  }

}
//switch off msg and img modes
showUpdates(){
  this.msgMode = false;
  this.imgMode=false;
  this.imageLoaded = false;
}

  onFileSelected(event){
    this.selectedImage = <File>event.target.files[0];
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
    submitForm.append("requirementId",this.selectedItemUpdates[this.updateIdx].requirementId)
    submitForm.append("itemId",this.selectedItemUpdates[this.updateIdx].itemId)
    submitForm.append("message",message)
    submitForm.append("donorId",this.selectedItemUpdates[this.updateIdx].donorId)
    submitForm.append("ngoId",this.selectedItemUpdates[this.updateIdx].ngoId)
    if(this.selectedImage!=null)
    submitForm.append("image",this.selectedImage)
  //Call API
    this.donorService.sendMessageToNgo(submitForm).subscribe((data)=>{
     
  var updates:DonorUpdate[];
    //get local copy of updates
        updates =  this.donorService.getDonorUpdates();
        var itemUpdates = {};
    itemUpdates = {
      "updateType":"message",
      "reqId":this.selectedItemUpdates[this.updateIdx].requirementId,
      "itemId":this.selectedItemUpdates[this.updateIdx].itemId,
      "ngoId":this.selectedItemUpdates[this.updateIdx].ngoId,
      "ngoName":this.selectedItemUpdates[this.updateIdx].ngoName,
      "donorId":this.selectedItemUpdates[this.updateIdx].donorId,
      "message":message,
      "messageFrom":"donor",
      "updateDate":new Date().toISOString(),
      "imageLink":data["imageId"]
  }

//update donorUpdate copy on Server
  updates[itemIndex].itemUpdates.push(itemUpdates)
  this.donorService.setDonorUpdates(updates)

  //update local copy 
  this.selectedItemUpdates.push(new ItemUpdate("message",this.selectedItemUpdates[this.updateIdx].itemId,
  this.selectedItemUpdates[this.updateIdx].requirementId,this.selectedItemUpdates[this.updateIdx].ngoId
  ,this.selectedItemUpdates[this.updateIdx].donorId,
  this.selectedItemUpdates[this.updateIdx].ngoName,
  "",
  "",
  "donor",message,new Date().toISOString(),data["imageId"]));
  
  
  this.msgMode = false;
    }
    )

    
    
    
  }


  
  viewMsgImage(updateIdx:number){
    
    this.imgMode=true;
    this.utilityService.getImageFromServer(this.update.itemUpdates[updateIdx]["imageLink"]).subscribe((data)=>{
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


  acceptOrReject(updateIdx:number,actionTaken:string){
    const itemIndex = +this.route.snapshot.paramMap.get('id')-1
    var actionPerformed = false;
    const reqId = this.selectedItemUpdates[updateIdx].requirementId;
    for(var i =0;i<this.selectedItemUpdates.length;i++){
      if((this.selectedItemUpdates[updateIdx].updateType=="accept"||this.selectedItemUpdates[updateIdx].updateType=="decline")&&reqId==this.selectedItemUpdates[updateIdx].requirementId){
        actionPerformed= true;
        alert("You have already accepted or declined this requirement")
        
      }
    }
  
  
    if(!actionPerformed){
      var updates:DonorUpdate[];
          updates =  this.donorService.getDonorUpdates();
          var itemUpdates = {};
          if(actionTaken=="accept"){
         itemUpdates = {
          "updateType":"accept",
          "reqId":this.selectedItemUpdates[updateIdx].requirementId,
          "itemId":this.selectedItemUpdates[updateIdx].itemId,
          "ngoId":this.selectedItemUpdates[updateIdx].ngoId,
          "ngoName":this.selectedItemUpdates[updateIdx].ngoName,
          "donorId":this.selectedItemUpdates[updateIdx].donorId,
          "updateDate":new Date().toISOString()
      }
    }
      else if(actionTaken=="decline"){
         itemUpdates = {
          "updateType":"decline",
          "reqId":this.selectedItemUpdates[updateIdx].requirementId,
          "itemId":this.selectedItemUpdates[updateIdx].itemId,
          "ngoId":this.selectedItemUpdates[updateIdx].ngoId,
          "ngoName":this.selectedItemUpdates[updateIdx].ngoName,
          "donorId":this.selectedItemUpdates[updateIdx].donorId,
          "updateDate":new Date().toISOString()
      }
      }
        updates[itemIndex].itemUpdates.push(itemUpdates)
        
        this.donorService.setDonorUpdates(updates);
  

        //update local copy
        this.selectedItemUpdates.push(new ItemUpdate(actionTaken,this.selectedItemUpdates[updateIdx].itemId,
  this.selectedItemUpdates[updateIdx].requirementId,this.selectedItemUpdates[updateIdx].ngoId
  ,this.selectedItemUpdates[updateIdx].donorId,
  this.selectedItemUpdates[updateIdx].ngoName,
  "",
  "",
  "","",new Date().toISOString(),"-1"));
  
  
    this.donorService.acceptOrReject(
      this.selectedItemUpdates[updateIdx].requirementId,
      this.selectedItemUpdates[updateIdx].itemId,this.selectedItemUpdates[updateIdx].donorId,
      this.selectedItemUpdates[updateIdx].ngoId,    
    this.selectedItemUpdates[updateIdx].ngoName,
    actionTaken,this.selectedItemUpdates[updateIdx].reqQuantity).subscribe((data)=>{
     console.log(data)
    });
  }
  }
  
  

  viewItemImage(){
    
    this.imageString="";
    this.imgMode=true;
    this.utilityService.getImageFromServer(this.update.itemImageLink).subscribe((data)=>{
      if(data["image"]!="-1"){
      this.imageString = "data:image/jpeg;base64,"+data["image"]
      this.imageLoaded=true;
      }
      else{
        this.imageString=="-1";
        this.imageLoaded=false;
      }
    })
    //window.open(this.baseUrlForImage+this.donorUpdates[index].itemImageLink)
  }


  routeToUpdates(){
    this.donorService.currentPageChanged.next("updates");
    this.router.navigate(['/donor/updates/list'])
  }

  



}
