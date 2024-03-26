import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgToastModule } from 'ng-angular-popup';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    NgToastModule
  ],
  exports:[
    BsDropdownModule,
    NgToastModule
  ]
})
export class SharedModule { }
