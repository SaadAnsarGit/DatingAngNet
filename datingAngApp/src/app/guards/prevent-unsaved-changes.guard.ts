import { Injectable } from '@angular/core';
import { CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../components/member-edit/member-edit/member-edit.component';

@Injectable({
  providedIn:'root'
})

export class preventUnsavedChangesGuard implements CanDeactivate<unknown> {

  canDeactivate(component:MemberEditComponent):boolean{

    if(component.editForm.dirty){
      return confirm("Are you sure you want to continue , any unsaved changes will be lost");
    }
        return true;
    }
  
}
