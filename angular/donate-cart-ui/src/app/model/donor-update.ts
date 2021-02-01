import {ItemUpdate}  from './item-update'
export class DonorUpdate {
    itemId:string;
    itemName:string;
    itemCategory:string;
    itemSubCategory:string;
    itemQuantity:string;
    itemQuality:string;    
    itemDetails:string;
    itemImageLink:string;
    itemDate:string;
    itemUpdates:ItemUpdate[];

    constructor(itemId:string,name:string,cat:string,subcat:string,quant:string,quality:string,
        details:string,imgLink:string,date:string,itemUpdates:ItemUpdate[]){
            this.itemName = name;
            this.itemCategory = cat;
            this.itemSubCategory = subcat;
            this.itemQuality = quality;
            this.itemDetails=details;
            this.itemQuantity=quant;
            this.itemImageLink = imgLink;
            this.itemDate=date;
            this.itemUpdates=itemUpdates;
    }

}
