import { HttpClient } from '@angular/common/http';
import { Component, Input,OnInit,Output,EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../services/account.service';


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

    // this.Users=this.usersList;
    // console.log(this.Users);
    this.getUsers();
  }


  constructor(private http:HttpClient,private accountService:AccountService){

  }


  register(form:NgForm){
    this.accountService.register(this.Model)
    .subscribe(
      {
        next:res=>{
          console.log(res);
          form.reset();
          this.cancel();
        },
        error:err=>{
          console.log(err);
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
