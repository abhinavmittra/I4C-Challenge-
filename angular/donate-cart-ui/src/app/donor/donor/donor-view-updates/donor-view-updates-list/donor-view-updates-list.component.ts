import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DonorService } from 'src/app/donor/donor.service';
import { DonorUpdate } from 'src/app/model/donor-update';

@Component({
  selector: 'app-donor-view-updates-list',
  templateUrl: './donor-view-updates-list.component.html',
  styleUrls: ['./donor-view-updates-list.component.css']
})
export class DonorViewUpdatesListComponent implements OnInit {

  donorUpdates:DonorUpdate[]=[];
  donorUpdatesChanged:Subscription;




  constructor(private donorService:DonorService,private router:Router,private route:ActivatedRoute,private authService:AuthService) { }

  ngOnInit(): void {
    this.getDonorUpdates();
  }
  getDonorUpdates(){
    this.donorUpdates=this.donorService.getDonorUpdates()
    this.donorUpdatesChanged= this.donorService.donorUpdatesChanged.subscribe((data:DonorUpdate[])=>{
      this.donorUpdates=data; //get Donor Updates
     
    });   
     
    }


    viewItemUpdates(index:number){
      //navigate to details with index + 1 to show in url
      this.router.navigate(['../details',index+1],{relativeTo:this.route});

      
    }

    deleteItem(itemIndex:number){


      var actionPerformed = false;
      const itemId = this.donorUpdates[itemIndex].itemId;
      for(var i =0;i<this.donorUpdates[itemIndex].itemUpdates.length;i++){
        if(this.donorUpdates[itemIndex].itemUpdates[i]["updateType"]=="itemDeleted"&&itemId==this.donorUpdates[itemIndex].itemUpdates[i]["itemId"]){
          actionPerformed= true;
          alert("You have already deleted this item")
          
        }
      }
    
    
    
      if(!actionPerformed){
    
        var updates:DonorUpdate[];
        //get local copy of updates
            updates =  this.donorService.getDonorUpdates();
            var itemUpdates = {};
            
           itemUpdates = {
            "updateType":"itemDeleted",
            "itemId":updates[itemIndex].itemId,
            "updateDate":new Date().toISOString()
        }
      
          updates[itemIndex].itemUpdates.push(itemUpdates)
          
    
    
          
          //Remove any noupdate type objects because now we have a deleteItem type update
          for(var i =0;i<updates[itemIndex].itemUpdates.length;i++){
            if(updates[itemIndex].itemUpdates[i]["updateType"]=="noupdate"){
              updates[itemIndex].itemUpdates.splice(i,1)
              
            }
          }
          
    
          this.donorService.setDonorUpdates(updates);
    
    
          //call API
        this.donorService.deleteItem(    
        this.donorUpdates[itemIndex].itemId,
        this.authService.getUserId()
        ).subscribe((data)=>{
         console.log(data)
        });
      }
    }

    ngOnDestroy(){
      this.donorUpdatesChanged.unsubscribe();
    }
}
