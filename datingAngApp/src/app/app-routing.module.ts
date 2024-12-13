import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ListsComponent } from './components/lists/lists.component';
import { MemberDetailComponent } from './components/member-detail/member-detail.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { authGuard } from './guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './components/member-edit/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './components/photo-editor/photo-editor.component';

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
      {path:'members/:username',component:MemberDetailComponent},
      {path:'member/edit',component:MemberEditComponent,canDeactivate:[preventUnsavedChangesGuard]},
      {path:'photo-editor',component:PhotoEditorComponent}
    ]
  },
  {path:'errors',component:TestErrorsComponent},
  {path:'server-error',component:ServerErrorComponent},
  {path:'**',component:NotFoundComponent,pathMatch:'full'},
  {path:'not-found',component:NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
