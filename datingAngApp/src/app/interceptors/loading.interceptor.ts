import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BusyService } from '../services/busy.service';

@Injectable()
export class loadingInterceptor implements HttpInterceptor{

  constructor(private busyService:BusyService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.busyService.busy();
     return  next.handle(req).pipe(
      delay(1000),
      finalize(()=>{
        this.busyService.idle();
      })
     )
  }

}
