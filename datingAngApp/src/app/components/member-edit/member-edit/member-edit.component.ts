import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../../models/member';
import { User } from '../../../models/user';
import { take } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {

  member:Member;
  user:any;
  @ViewChild("editForm") editForm:NgForm;

  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue=true;
    }
  }

  constructor(private accountService:AccountService,private memberService:MembersService,private toast:NgToastService){
    this.accountService.currentUser$.pipe(take(1)).subscribe(currentUser=>this.user=currentUser);
  }

  ngOnInit(): void {
   this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(currentMember=>this.member=currentMember);
  }

  UpdateUser(){
    this.memberService.updateMember(this.member).
    subscribe({
      next:response=>{
        this.editForm.reset(this.member);
        this.toast.success({detail:"SUCCESS",summary:"User is updated successfully !",duration:3000});
      }
    })

  }


}
