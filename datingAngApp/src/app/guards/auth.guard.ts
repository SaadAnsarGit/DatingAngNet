import {CanActivate, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AccountService } from '../services/account.service';
import { NgToastService } from 'ng-angular-popup';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { error } from 'console';

@Injectable({
  providedIn:'root'
})

export class authGuard implements CanActivate{

  constructor(private accountService:AccountService,
    private toast:NgToastService,
    private router:Router
    ){}

  canActivate():boolean {
    if(localStorage.getItem("user")!=null){
      return true;
    }
    else{
      this.toast.error({detail:"ERROR",summary:"You should login !",duration:3000});
      this.router.navigateByUrl('/');
      return false;
    }
  }
}

