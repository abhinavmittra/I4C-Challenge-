export class ItemUpdate {
    updateType:string;
    ngoName:string;
    itemId:string;
    requirementId:string;
    constructor(type:string,ngoName:string,itemId:string,requirementId:string){
        this.updateType=type;
        this.ngoName=ngoName;
        this.itemId=itemId;
        this.requirementId=requirementId;
    }
}
