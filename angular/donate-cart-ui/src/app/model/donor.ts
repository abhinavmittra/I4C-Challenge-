export class Donor {
    public name:string;
    public address:string;
    public pincode:string;
    public phone:string;
    public email:string;
    public password:string;

    constructor(name:string,address:string,pincode:string,phone:string,email:string,password:string){
        this.name=name;
        this.address=address;
        this.pincode=pincode;
        this.phone=phone;
        this.email=email;
        this.password=password;
    }
}
