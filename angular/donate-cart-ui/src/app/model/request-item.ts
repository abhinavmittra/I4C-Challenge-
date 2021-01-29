export class RequestItem {
    
    updateId:string;
    quantity:string;
    quality:string;
    details:string;
    constructor(updateId:string,quantity:string,details:string){
        this.updateId=updateId;
        this.quantity=quantity;
        this.details=details
    }
}
