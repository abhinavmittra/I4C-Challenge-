export class ItemRequirement {
    name:string;
    category:string;
    subcategory:string;
    quantity:number;
    neededFor:string;
    ngoId:string;

    constructor(name:string,category:string,subcategory:string,quantity:number,neededFor:string,ngoId:string){
        this.name = name;
        this.category=category;
        this.subcategory=subcategory;
        this.quantity=quantity;
        this.neededFor=neededFor;
        this.ngoId=ngoId;
    }
}
