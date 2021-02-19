import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DoneeUpdate } from 'src/app/model/donee-update';
import { DoneeService } from '../../donee.service';

@Component({
  selector: 'app-donee-view-updates-list',
  templateUrl: './donee-view-updates-list.component.html',
  styleUrls: ['./donee-view-updates-list.component.css']
})
export class DoneeViewUpdatesListComponent implements OnInit {
  doneeUpdates:DoneeUpdate[]=[];
  doneeUpdatesChanged:Subscription;
  constructor(private doneeService:DoneeService,private authService:AuthService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.getDoneeUpdates()
  }
  getDoneeUpdates(){
    this.doneeUpdates=this.doneeService.getDoneeUpdates() 
    this.doneeUpdatesChanged= this.doneeService.doneeUpdatesChanged.subscribe((data:DoneeUpdate[])=>{
      this.doneeUpdates=data; //get Donee Updates
     
    });
    
     
    }

viewReqUpdates(index:number){
  this.router.navigate(['../details',index+1],{relativeTo:this.route});
}

    deleteReq(reqIndex:number){
      var actionPerformed = false;
    const reqId = this.doneeUpdates[reqIndex].reqId;
    for(var i =0;i<this.doneeUpdates[reqIndex].reqUpdates.length;i++){
      if(this.doneeUpdates[reqIndex].reqUpdates[i]["updateType"]=="requirementDeleted"&&reqId==this.doneeUpdates[reqIndex].reqUpdates[i]["reqId"]){
      actionPerformed= true;
      alert("You have already deleted this requirement")
      
      }
   }
   if(!actionPerformed){


    var updates:DoneeUpdate[];
    //get local copy of updates
        updates =  this.doneeService.getDoneeUpdates();
        var itemUpdates = {};
        
       itemUpdates = {
        "updateType":"requirementDeleted",
        "reqId":updates[reqIndex].reqId,
        "updateDate":new Date().toISOString()
    }
  
      updates[reqIndex].reqUpdates.push(itemUpdates)
      


      
      //Remove any noupdate type objects because now we have a deleteItem type update
      for(var i =0;i<updates[reqIndex].reqUpdates.length;i++){
        if(updates[reqIndex].reqUpdates[i]["updateType"]=="noupdate"){
          updates[reqIndex].reqUpdates.splice(i,1)
          
        }
      }
      
      console.log(updates)
      this.doneeService.setDoneeUpdates(updates);



    //Call API
   this.doneeService.deleteRequirement(this.doneeUpdates[reqIndex].reqId,
          this.authService.getUserId()).subscribe((data)=>{
         console.log(data)
        });
   }    
  
    }


    ngOnDestroy()
    {
      this.doneeUpdatesChanged.unsubscribe();
    }

}
