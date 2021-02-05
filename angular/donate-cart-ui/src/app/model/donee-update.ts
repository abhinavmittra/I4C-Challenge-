export class DoneeUpdate {
    reqId:string;
    reqName:string;
    reqCategory:string;
    reqSubCategory:string;
    reqQuantity:string;  
    reqDetails:string;
    req:string;    
    reqDate:string;
    reqUpdates:any;

    constructor(reqId:string,name:string,cat:string,subcat:string,quant:string,
        details:string,date:string,itemUpdates:any){
            this.reqId = reqId;
            this.reqName = name;
            this.reqCategory = cat;
            this.reqSubCategory = subcat;
           this.reqDetails = details
            this.reqQuantity=quant;
            
            this.reqDate=date;
            this.reqUpdates=itemUpdates;
}
}
