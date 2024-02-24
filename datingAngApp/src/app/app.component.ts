import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'datingAngApp';
  users!:any;

  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    return this.http.get<any>('https://localhost:7011/api/Users/getUsers')
    .subscribe({
      next:res=>{
           this.users=res;
      },
      error:err=>{
         console.log(err);
      }
    })
  }
}
