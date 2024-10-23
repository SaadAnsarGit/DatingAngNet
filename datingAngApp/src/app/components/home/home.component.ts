import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { Member } from '../../models/member';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  registerMode:boolean=false;
  baseUrl:string="https://localhost:7011/api/Users";
  users:any;
  
  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle(){
    this.registerMode=!this.registerMode;
  }

  getUsers(){
    return this.http.get<any>(`${this.baseUrl}/getUsers`)
    .subscribe({
      next:res=>{
        debugger;
        this.users=res;
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  registrationMode(event:boolean){
    this.registerMode=event;
  }

}
