import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ListsComponent } from './components/lists/lists.component';
import { MemberDetailComponent } from './components/member-detail/member-detail.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {
    path:'',
    canActivate:[authGuard],
    runGuardsAndResolvers:'always',
    children:[
      {path:'messages',component:MessagesComponent},
      {path:'lists',component:ListsComponent},
      {path:'members',component:MemberListComponent},
      {path:'member/:id',component:MemberDetailComponent}
    ]
  },
  {path:'**',component:HomeComponent,pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
