import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Member } from '../models/member';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
 
  members:Member[]=[];
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
    debugger;
    if(this.members.length>0){
      return of(this.members);
    }
    return this.https.get<Member[]>(`${this.baseUrl}/Users`).pipe(
      map(Members=>{
        this.members=Members;
        return this.members;
      })
    )
  }

  handleError(error){
     return throwError(error.message || 'Server Error');
  }

  getMember(username){
    const member=this.members.find(x=>x.username===username);
    if(member!==undefined){
      return of(member);
    }
    return this.https.get<Member>(`${this.baseUrl}/Users`+'/'+username);
  }

  updateMember(member:Member){
    return this.https.put<any>(`${this.baseUrl}/Users`,member).pipe(
      map(()=>{
        const index=this.members.indexOf(member);
        this.members[index]=member;
      })
    )
  }

  setMainPhoto(photoId:number){
    return this.https.put<any>(`${this.baseUrl}/Users/set-main-photo/`+photoId,photoId);
  }

  deletePhoto(photoId:any){
    return this.https.delete<any>(`${this.baseUrl}/Users/delete-photo/`+photoId,photoId);
  }
}
