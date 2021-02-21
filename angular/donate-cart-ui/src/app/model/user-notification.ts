export class UserNotification {

    date:string;
    message:string;
    action:string;
    linkedToId:string;

    constructor(date:string,message:string,action:string,linkedToId:string){
        this.date = date ;
        this.message=message;
        this.action=action;
        this.linkedToId=linkedToId;
    }

}
