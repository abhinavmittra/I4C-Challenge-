export class DoneeViewUpdateItem {
    requirementId:string;
    name:string;
    category:string;
    subcategory:string;
    details:string;
    quantity:string;
    status:string;
    constructor(reqId:string,name:string,category:string,subcat:string,details:string,quantity:string,
        status:string){
            this.requirementId = reqId;
            this.name = name;
            this.category = category;
            this.subcategory = subcat;
            this.details = details;
            this.quantity = quantity;
            this.status = status;
        }
}
