import { Component,OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

  members:Member[];

  constructor(private memberService:MembersService){}

  ngOnInit():void{
    this.loadMembers();
    // console.log(this.members);
  }

  loadMembers(){
    this.memberService.getMembers()
    .subscribe({
      next:(res:any)=>{
        debugger;
          this.members=res;
          // console.log(this.members);
      }
    })
  }

 
}
