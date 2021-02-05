export class RequirementUpdate {
    updateType:string;
    itemId:string;
    requirementId:string;
    ngoId:string;
    donorId:string;
    ngoName:string;
    itemImageLink:string;
    itemQuality:string;
    itemQuantity:string;
    itemDetails:string;
    pincode:string;
    messageFrom:string;
    message:string;
    updateDate:string;
        
    constructor(type:string,itemId:string,requirementId:string,ngoId:string,
        donorId:string,pincode:string,ngoName:string,itemQuantity:string,quality:string,imgLink:string,itemDetails:string,
        messageFrom:string,message:string,updateDate:string
        ){
        this.updateType=type;        
        this.itemId=itemId;
        this.requirementId=requirementId;
        this.ngoId = ngoId;
        this.donorId = donorId;
        this.ngoName = ngoName;
        this.pincode = pincode;
        this.itemQuantity = itemQuantity;
        this.itemDetails = itemDetails;
        this.messageFrom = messageFrom;
        this.message = message;
        this.updateDate = updateDate;
        this.itemQuality = quality;
        this.itemImageLink = imgLink;
    }
}
