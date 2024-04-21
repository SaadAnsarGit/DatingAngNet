import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {

  baseUrl:string="https://localhost:7011/api";
  validationErrors:string[]=[];

  constructor(private Http:HttpClient, private toast:NgToastService){}

  get404Errors(){
    this.Http.get<any>(`${this.baseUrl}/Buggy/not-found`)
    .subscribe({
      next:res=>{
        console.log(res);
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  get400Errors(){
    this.Http.get<any>(`${this.baseUrl}/Buggy/bad-request`)
    .subscribe({
      next:res=>{
        console.log(res);
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  get500Errors(){
    this.Http.get<any>(`${this.baseUrl}/Buggy/server-error`)
    .subscribe({
      next:res=>{
        console.log(res);
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  get401Errors(){
    this.Http.get<any>(`${this.baseUrl}/Buggy/auth`)
    .subscribe({
      next:res=>{
        console.log(res);
      },
      error:err=>{
        console.log(err);
      }
    })
  }

  get400ValidationErrors(){
    this.Http.post<any>(`${this.baseUrl}/Account/Register`,{})
    .subscribe({
      next:res=>{
        console.log(res);
      },
      error:err=>{
        this.validationErrors=err;
        
      }
    })
  }

}
