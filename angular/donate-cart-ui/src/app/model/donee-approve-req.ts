export class DoneeApproveReq {
    public id:string;
    public name:string;
    public email:string;
    public phone:string;
    public pan:string;
    public address:string;
    public pincode:string;
    public imageLink:string;
    constructor(id:string,name:string,email:string,phone:string,pan:string,address:string,pincode:string,
        imageLink:string){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.pan = pan;
        this.address = address;
        this.pincode = pincode;
        this.imageLink=imageLink
    }
    

}
