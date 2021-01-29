import { destroyPlatform } from "@angular/core";

export class DonorViewUpdateItem {
    itemId:string;
    name:string;
    category:string;
    subcategory:string;
    details:string;
    quantity:string;
    quality:string;
    status:string;
    constructor(itemId:string,name:string,category:string,subcat:string,details:string,quantity:string,
        quality:string,status:string){
            this.itemId = itemId;
            this.name = name;
            this.category = category;
            this.subcategory = subcat;
            this.details = details;
            this.quantity = quantity;
            this.quality = quality;
            this.status = status;
        }
}
