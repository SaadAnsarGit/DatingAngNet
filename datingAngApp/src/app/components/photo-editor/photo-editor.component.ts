import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../services/account.service';
import { take } from 'rxjs';
import { User } from '../../models/user';
import { Photo } from '../../models/photo';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {

  @Input() member:Member;
  user:any;

  uploader:FileUploader;
  hasBaseDropZoneOver:boolean=false;
  baseUrl="https://localhost:7011/api/Users";

  constructor(private accountService:AccountService,private memberService:MembersService){
    this.accountService.currentUser$.pipe(take(1)).subscribe(currentUser=>this.user=currentUser);
   }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e:any){
    this.hasBaseDropZoneOver=e;
  }

  initializeUploader(){
    debugger;
    this.uploader=new FileUploader({
      url:`${this.baseUrl}/add-photo`,
      authToken:'Bearer '+this.user.token,
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10*1024*1024
    });

    this.uploader.onAfterAddingFile=(file)=>{
      file.withCredentials=false;
    };

    this.uploader.onSuccessItem=(item,response,status,headers)=>{
      debugger;
      if (typeof response === "string" && response.trim().startsWith("<!DOCTYPE html>")) {
        console.error("Received an HTML response instead of JSON. Response:", response);
        return;
    }
      if(response){
        // console.log(JSON.stringify(response));
          let photo:Photo=JSON.parse(response);
          this.member.photos.push(photo);
          if(photo.isMain){
            this.user.photoUrl=photo.url;
            this.accountService.setCurrentUser(this.user);
            this.member.photoUrl=photo.url;
          }
      }
    };
  }

  setMainPhoto(photo:Photo){
     this.memberService.setMainPhoto(photo.id).subscribe({
        next:(res)=>{
          this.member.photoUrl=photo.url;
          this.user.photoUrl=photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photos.forEach(d=>{
            if(d.isMain){
              d.isMain=false;
            }
            if(d.id===photo.id){
              d.isMain=true;
            }
          })
        }
     })
  }

  deletePhoto(photo:Photo){
     this.memberService.deletePhoto(photo.id).subscribe({
       next:()=>{
        this.member.photos=this.member.photos.filter(x=>x.id!==photo.id);
       }
     })
  }

}
