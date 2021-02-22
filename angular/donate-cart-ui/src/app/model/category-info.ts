export class CategoryInfo {
    public name:string;
    public subCategories:string[];


    constructor(name:string,subcatList:string[]){
        this.name=name;
        this.subCategories=subcatList;
    }
}
