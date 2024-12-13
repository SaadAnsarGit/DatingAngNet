import { HttpClient } from '@angular/common/http';
import { Component,OnInit,Output,EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup,ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {

  Users:any=[];
  registerForm:FormGroup;
  validationErrors:string[]=[];

  @Output() registerToggle=new EventEmitter<boolean>();

  baseUrl:string="https://localhost:7011/api/Users";
  
  maxDate:Date;

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate=new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }


  constructor(private http:HttpClient,
    private accountService:AccountService,
    private toast:NgToastService,
    private fb:FormBuilder,
    private route:Router
    ){

  }

  initializeForm(){
    this.registerForm=this.fb.group({
      gender:['male'],
      knownAs:['',Validators.required],
      dateOfBirth:['',Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      username:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',[Validators.required,this.matchValues('password')]]
    });

    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo:string):ValidatorFn{
    return (control:AbstractControl)=>{
      return control?.value===control?.parent?.controls[matchTo].value ? null : {isMatching:true}
    }
  }

  register(){
    this.accountService.register(this.registerForm.value)
    .subscribe(
      {
        next:res=>{
          console.log(res);
          this.toast.success({detail:"SUCCESS",summary:"Register done !",duration:3000});
          this.route.navigateByUrl('/members');
          // this.cancel();
        },
        error:err=>{
          console.log(err);
          this.validationErrors=err;
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
