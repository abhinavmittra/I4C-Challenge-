export class ItemRequirement {
    name:string;
    category:string;
    subcategory:string;
    details:string;
    quantity:number;
    ngo:string;
    ngoId:string;

    constructor(name:string,category:string,subcategory:string,details:string,quantity:number,ngo:string,ngoId:string){
        this.name = name;
        this.category=category;
        this.subcategory=subcategory;
        this.details=details
        this.quantity=quantity;
        this.ngo=ngo;
        this.ngoId=ngoId;
    }
}
