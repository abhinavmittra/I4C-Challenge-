export class ItemUpdate {
    updateType:string;
    itemId:string;
    requirementId:string;
    ngoId:string;
    donorId:string;
    ngoName:string;
    reqQuantity:string;
    reqDetails:string;
    messageFrom:string;
    message:string;
    updateDate:string;
        
    constructor(type:string,itemId:string,requirementId:string,ngoId:string,
        donorId:string,ngoName:string,reqQuantity:string,reqDetails:string,
        messageFrom:string,message:string,updateDate:string
        ){
        this.updateType=type;        
        this.itemId=itemId;
        this.requirementId=requirementId;
        this.ngoId = ngoId;
        this.donorId = donorId;
        this.ngoName = ngoName;
        this.reqQuantity = reqQuantity;
        this.reqDetails = reqDetails;
        this.messageFrom = messageFrom;
        this.message = message;
        this.updateDate = updateDate;
    }
}
