export class UserNotification {

    date:string;
    message:string;
    action:string;
    requirementId:string;
    donorId:string;
    itemId:string;
    ngoId:string;

    constructor(date:string,message:string,action:string,requirementId:string,donorId:string,
        itemId:string,ngoId:string){
        this.date = date;
        this.message=message;
        this.action=action;
        this.requirementId=requirementId;
        this.donorId=donorId;
        this.itemId=itemId;
        this.ngoId=ngoId;

    }

}
