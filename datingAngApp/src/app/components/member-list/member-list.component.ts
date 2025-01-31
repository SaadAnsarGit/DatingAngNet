import { Component,OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { Observable, take } from 'rxjs';
import { Pagination } from '../../models/pagination';
import { userParams } from '../../models/userParams';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/user';
import { table } from 'console';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

  members:Member[]=[];
  pagination:Pagination;
  userParam:userParams=new userParams();
  user:User;
  genderList=[{value:'female',display:'females'},{value:'male',display:'males'}]

  constructor(private memberService:MembersService){
    this.userParam=this.memberService.getUserParams();
  }

  ngOnInit():void{
    this.loadMembers();
  }

  loadMembers(){
    debugger;
    this.memberService.setUserParams(this.userParam);
    this.memberService.getMembers(this.userParam)
    .subscribe({
      next:response=>{
        this.members=response.result;
        this.pagination=response.pagination;
      }
    })
  }

  pageChanged(event:any){
   this.userParam.pageNumber=event.page;
   this.loadMembers();
  }

  resetFilters(){
   this.userParam=this.memberService.resetFiltersParam();
    this.loadMembers();
  }
 
}
