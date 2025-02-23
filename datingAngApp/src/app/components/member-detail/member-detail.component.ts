import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from '../../models/member';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {

 member:Member;
 galleryImages:NgxGalleryImage[];
 galleryOptions:NgxGalleryOptions[];


 ngOnInit():void{
  debugger;
   this.loadMember();

   this.galleryOptions=[{
     width:'500px',
     height:'500px',
     imagePercent: 100,
     thumbnailsColumns:4,
     imageAnimation: NgxGalleryAnimation.Slide,
     preview: false
   },
  ];

 }

     constructor(private memberService:MembersService,private route:ActivatedRoute){}

     getImages():NgxGalleryImage[]{
        const imageUrls=[];
        debugger;
         for(const photo of this.member.photos){
          imageUrls.push({
            small:photo?.url,
            medium:photo?.url,
            big:photo?.url
          });
          return imageUrls;
         }
     }


     loadMember(){
      const username=this.route.snapshot.paramMap.get("username");
      this.memberService.getMember(username).subscribe(user=>{
        this.member=user;
        this.galleryImages=this.getImages();
      })
      }
}
