import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  model:any={};
  // currentUser$:Observable<User>;
  constructor(public accountService:AccountService){}


  ngOnInit(): void {
    // this.currentUser$=this.accountService.currentUser$;
  }

  

  login(form:NgForm){
    this.accountService.login(this.model)
    .subscribe({
      next:res=>{
        form.reset();
         console.log(res);
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  logout(){
    this.accountService.logout();
  }

}
