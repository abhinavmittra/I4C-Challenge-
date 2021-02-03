export class Donee {
    public name:string;
    public address:string;
    public pincode:string;
    public phone:string;
    public website:string;
    public panno:string;
    public description:string;
    public email:string;
    public password:string;
    
    

    constructor(name:string,address:string,pincode:string,phone:string,panno:string,website:string,description:string,email:string,password:string){
        this.name=name;
        this.address=address;
        this.pincode=pincode;
        this.phone=phone;
        this.website=website;
        this.panno=panno;
        this.email=email;
        this.password=password;
        this.description=description;
    }
}
