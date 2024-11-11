import { Component,OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

  members$:Observable<Member[]>;
  // members:Member[]=[];

  constructor(private memberService:MembersService){}

  ngOnInit():void{
    debugger;
    this.members$=this.memberService.getMembers();
  }
 
}
