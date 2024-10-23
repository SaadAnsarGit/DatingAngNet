import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgToastModule } from 'ng-angular-popup';
import { RouterModule } from '@angular/router';
import {TabsModule} from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    NgToastModule,
    RouterModule,
    TabsModule.forRoot(),
    NgxGalleryModule
  ],
  exports:[
    BsDropdownModule,
    NgToastModule,
    TabsModule,
    NgxGalleryModule
  ]
})
export class SharedModule { }
