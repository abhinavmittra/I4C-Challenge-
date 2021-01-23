export class DoneeReg {
    public name:string;
    public address:string;
    public pincode:string;
    public phone:string;
    public website:string;
    public panno:string;
    public email:string;
    
    

    constructor(name:string,address:string,pincode:string,phone:string,panno:string,website:string,email:string){
        this.name=name;
        this.address=address;
        this.pincode=pincode;
        this.phone=phone;
        this.website=website;
        this.panno=panno;
        this.email=email;
       
    }
}
