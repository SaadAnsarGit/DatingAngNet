import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  model:any={};
  // currentUser$:Observable<User>;
  constructor(public accountService:AccountService,
    private router:Router,
    private toast:NgToastService
    ){}


  login(form:NgForm){
    this.accountService.login(this.model)
    .subscribe({
      next:res=>{
        form.reset();
        this.toast.success({detail:"SUCCESS",summary:"login succeded !",duration:3000});
        this.router.navigateByUrl('/members');
      },
      error:err=>{
        console.log(err);
        this.toast.error({detail:"ERROR",summary:"Login Error !",duration:3000});
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
