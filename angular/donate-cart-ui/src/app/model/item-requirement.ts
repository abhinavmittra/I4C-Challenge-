export class ItemRequirement {
    name:string;
    category:string;
    subcategory:string;
    details:string;
    quantity:number;
    neededFor:string;
    ngo:string;

    constructor(name:string,category:string,subcategory:string,details:string,quantity:number,neededFor:string,ngo:string){
        this.name = name;
        this.category=category;
        this.subcategory=subcategory;
        this.details=details
        this.quantity=quantity;
        this.neededFor=neededFor;
        this.ngo=ngo;
    }
}
