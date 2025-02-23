import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { User } from '../models/user';
import { ReplaySubject } from 'rxjs';
import { MembersService } from './members.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  // L'environement de development ou y a la valeur de BaseUrl
  baseUrl:string="https://localhost:7011/api/Account";
  private setCurrentUserSource=new ReplaySubject<User>(1);
  currentUser$=this.setCurrentUserSource.asObservable();

  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post<any>(`${this.baseUrl}/Login`,model).pipe(
      map((response:User)=>{
         const user=response;
         console.log(user);
         if(user){
          this.setCurrentUser(user);
         }
      })
    )
  }

  register(model:any){
    return this.http.post<any>(`${this.baseUrl}/Register`,model).pipe(
      map((response:User)=>{
          const user=response;
          if(user){
            this.setCurrentUser(user);
          }
          return user;
      })
    )
  }

  setCurrentUser(user:User){
   localStorage.setItem("user",JSON.stringify(user));
   this.setCurrentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem("user");
    this.setCurrentUserSource.next(null);
  }

}
