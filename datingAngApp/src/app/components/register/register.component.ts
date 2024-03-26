import { HttpClient } from '@angular/common/http';
import { Component, Input,OnInit,Output,EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {

  Model:any={};
  usersList:any=[];
  Users:any=[];

  @Input() usersFromHomeComponent:any;
  @Output() registerToggle=new EventEmitter<boolean>();

  baseUrl:string="https://localhost:7011/api/Users";

  ngOnInit(): void {
    debugger;
    this.usersFromHomeComponent.forEach(element => {
      this.usersList.push(element);
    });
    this.getUsers();
  }


  constructor(private http:HttpClient,
    private accountService:AccountService,
    private toast:NgToastService
    ){

  }

  register(form:NgForm){
    this.accountService.register(this.Model)
    .subscribe(
      {
        next:res=>{
          console.log(res);
          form.reset();
          this.toast.success({detail:"SUCCESS",summary:"Register done !",duration:3000});
          this.cancel();
        },
        error:err=>{
          console.log(err);
          this.toast.error({detail:"ERROR",summary:err.error.message,duration:3000});
        }
      }
    )
  }

  cancel(){
    this.registerToggle.emit(false);
  }

  getUsers(){
    return this.http.get<any>(`${this.baseUrl}/getUsers`)
    .subscribe({
      next:res=>{
        debugger;
        this.Users=res;
        console.log(this.Users);
      },
      error:err=>{
        console.log(err);
      }
    })
  }

}
