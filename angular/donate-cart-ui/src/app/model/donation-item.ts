import { ThrowStmt } from "@angular/compiler";

export class DonationItem {
    donorId:string;
    itemId:string;
    name:string;
    category:string;
    subcategory:string;
    details:string;
    quantity:number;
    quality:number;
    imgLink:string;

    constructor(itemId:string,name:string,category:string,subcat:string,details:string,quantity:number,quality:number,donorId:string,imgLink:string){
        this.donorId=donorId;
        this.itemId = itemId;
        this.name=name;
        this.category=category;
        this.subcategory=subcat;
        this.details=details;
        this.quantity=quantity;
        this.quality=quality;
        this.imgLink = imgLink;
    }
}
