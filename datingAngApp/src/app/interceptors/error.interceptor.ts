import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private router:Router,private toast:NgToastService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error=>{
        if(error){
          switch(error.status){
            case 400:
              console.log(error.error.errors);
              if(error.error.errors){
                const modelStateErrors=[];
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                    modelStateErrors.push(error.error.errors[key])
                  }
                  debugger;
                  // console.log(modelStateErrors);
                }
                throw modelStateErrors.flat();
              }
              else{
                this.toast.error({detail:"ERROR",summary:error.error,duration:3000});
              }
              break;
            case 401:
              this.toast.error({detail:"ERROR",summary:"ERROR warning"
              ,duration:3000});
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras:NavigationExtras={state:{error:error.error}}
              this.router.navigateByUrl('/server-error',navigationExtras);
              break;  
            default:
              this.toast.error({detail:"ERROR",summary:"Something was expected went wrong",duration:3000});
              console.log(error);
              break;
          }
        }
        return throwError(error);
      }
      )
    )
  }

}


