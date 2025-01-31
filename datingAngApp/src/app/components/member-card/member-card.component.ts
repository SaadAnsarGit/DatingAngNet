import { Component,Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { Router, RouterModule, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css',
})
export class MemberCardComponent implements OnInit {
 
  @Input() member:any;

  ngOnInit(): void {
  }

  constructor(private route:Router){}

  goMemberDetails(username:string){
    debugger;
    this.route.navigateByUrl('members/:'+username);
  }

}
