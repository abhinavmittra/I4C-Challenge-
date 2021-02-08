export class ItemRequirement {
    requirementId:string;
    name:string;
    category:string;
    subcategory:string;
    details:string;
    quantity:string;
    ngoId:string;
    ngo:string;
    date:string;
    pincode:string;

    constructor(requirementId:string,name:string,category:string,subcategory:string,details:string,quantity:string,ngoId:string,ngo:string,date:string,pincode:string){
        this.requirementId = requirementId;
        this.name = name;
        this.category=category;
        this.subcategory=subcategory;
        this.details=details
        this.quantity=quantity;
        this.ngoId=ngoId;
        this.ngo= ngo;
        var formattedDate = new Date(date)
        this.date = formattedDate.toLocaleString()
        this.pincode = pincode;
    }
}
