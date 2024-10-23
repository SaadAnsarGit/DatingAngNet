import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';
import { take } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class jwtInterceptor implements HttpInterceptor{

  constructor(private accountService:AccountService){}

  intercept(request:HttpRequest<unknown>,next:HttpHandler){

    let currentUser:any;
    debugger;

    this.accountService.currentUser$.pipe(take(1)).subscribe(user=>currentUser=user);

    if(currentUser){
      request=request.clone({
        setHeaders:{
          Authorization:`Bearer ${currentUser.token}`
        }
      });
    }

     return next.handle(request);
  }

}
