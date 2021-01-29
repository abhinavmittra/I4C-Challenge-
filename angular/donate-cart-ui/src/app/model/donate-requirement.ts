export class DonateRequirement {
    updateId:string; // reqd to fetch image
    quantity:string;
    quality:string;
    details:string;

    constructor(id:string,quantity:string,quality:string,details:string){
        this.updateId = id;
        this.quality = quality;
        this.quantity = quantity;
        this.details = details;
    }


}
