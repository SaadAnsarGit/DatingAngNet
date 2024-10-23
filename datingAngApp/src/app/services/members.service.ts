import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Member } from '../models/member';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
 
  baseUrl:string="https://localhost:7011/api";

  httpOptions={
    headers:new HttpHeaders({
      Authorization:'Bearer '+JSON.parse(localStorage.getItem('user')).token,
      'Content-Type':  'application/json',
       "Access-Control-Allow-Origin": "*",
    })
  }

  constructor(private https:HttpClient) { }

  getMembers(){
    return this.https.get<Member[]>(`${this.baseUrl}/Users`);
  }

  handleError(error){
     return throwError(error.message || 'Server Error');
  }

  getMember(username){
    return this.https.get<Member>(`${this.baseUrl}/Users`+'/'+username);
  }
}
