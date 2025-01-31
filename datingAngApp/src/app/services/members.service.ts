import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, take, throwError } from 'rxjs';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { response } from 'express';
import { userParams } from '../models/userParams';
import { User } from '../models/user';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
 
  members:Member[]=[];
  baseUrl:string="https://localhost:7011/api";
  paginatedResult:PaginatedResult<Member[]>=new PaginatedResult<Member[]>();
  user:User;
  memberCache=new Map<Object,PaginatedResult<Member[]>>();
  userParams=new userParams();

  httpOptions={
    headers:new HttpHeaders({
      Authorization:'Bearer '+JSON.parse(localStorage.getItem('user')).token,
      'Content-Type':  'application/json',
       "Access-Control-Allow-Origin": "*",
    })
  }

  constructor(private https:HttpClient,private accountService:AccountService) {
    debugger;
    this.accountService.currentUser$.pipe(take(1)).subscribe(currentUser=>{
       this.user=currentUser;
       this.userParams=new userParams(this.user);
    })
   }

   getUserParams(){
    return this.userParams;
   }

   setUserParams(userParam:userParams){
    debugger;
     this.userParams=userParam;
   }
   resetFiltersParam(){
    return this.userParams=new userParams(this.user);
   }

  getMembers(userParam:userParams){

    let params=this.getPaginationHeaders(userParam.pageNumber,userParam.pageSize);

    params=params.append("minAge",userParam.minAge.toString());
    params=params.append("maxAge",userParam.maxAge.toString());
    params=params.append("gender",userParam.gender);
    params=params.append("orderBy",userParam.orderBy);
    
    return this.getPaginatedResult(params)
    .pipe(map(response=>{
        const clonedResponse = structuredClone(response) || JSON.parse(JSON.stringify(response));
        this.memberCache.set(Object.values(userParam).join('-'),clonedResponse);
        console.log(this.memberCache);
        return response;
    }))
  }
   
  


  handleError(error){
     return throwError(error.message || 'Server Error');
  }

  getMember(username){
    debugger;
   const member=[...this.memberCache.values()]
   .reduce((arr,elem)=>arr.concat(elem.result),[])
   .find(d=>d.username===username);

   if(member){
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


  private getPaginatedResult(params: HttpParams) {
    return this.https.get<Member[]>(`${this.baseUrl}/Users`, { observe: 'response', params }).pipe(
      map(response => {
        this.paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          this.paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
        }
        return this.paginatedResult;
      })
    );
  }

  private getPaginationHeaders(page:number,itemsPerPage:number){
    let params=new HttpParams();
    if(page!==null && itemsPerPage!==null){
      params=params.append("pageNumber",page.toString());
      params=params.append("pageSize",itemsPerPage.toString());
    }
    return params;
  }

}
