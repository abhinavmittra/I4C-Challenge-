export class SubmitRequirement {
    name:string;
    category:string;
    subcategory:string;
    details:string;
    quantity:string;
    ngoId:string;

    constructor(name:string,category:string,subcategory:string,details:string,quantity:string,ngoId:string){
        this.name = name;
        this.category=category;
        this.subcategory=subcategory;
        this.details=details
        this.quantity=quantity;
        this.ngoId=ngoId;
    }
}
