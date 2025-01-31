import { User } from "./user";

export class userParams{
    gender:string;
    minAge=18;
    maxAge=99;
    pageNumber=1;
    pageSize=6;
    orderBy="LastActive";
    
    constructor(user?:User){
        debugger;
        if(user){
            this.gender=user.gender==='female'?'male':'female';
        }
    }
    
}