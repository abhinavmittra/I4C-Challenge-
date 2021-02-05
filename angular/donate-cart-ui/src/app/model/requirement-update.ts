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
    messageFrom:string;
    message:string;
    updateDate:string;
        
    constructor(type:string,itemId:string,requirementId:string,ngoId:string,
        donorId:string,ngoName:string,itemQuantity:string,itemDetails:string,
        messageFrom:string,message:string,updateDate:string
        ){
        this.updateType=type;        
        this.itemId=itemId;
        this.requirementId=requirementId;
        this.ngoId = ngoId;
        this.donorId = donorId;
        this.ngoName = ngoName;
        this.itemQuantity = itemQuantity;
        this.itemDetails = itemDetails;
        this.messageFrom = messageFrom;
        this.message = message;
        this.updateDate = updateDate;
    }
}
