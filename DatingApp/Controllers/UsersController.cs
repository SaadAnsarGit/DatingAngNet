using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.DTO;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
      
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper ;
        private readonly IPhotoService photoService;

        public UsersController(IUserRepository userRepository,IMapper mapper,IPhotoService photoService){
           this.userRepository=userRepository;
           this.mapper=mapper;
           this.photoService=photoService;
        }
        
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>>GetAllUsers(){

        //    var users=await this.userRepository.GetUsersAsync();
        //    var usersToReturn=this.mapper.Map<IEnumerable<MemberDto>>(users);
        //     return Ok(usersToReturn);
            return Ok(await userRepository.GetMembersAsync());
        }

        [HttpGet("{username}",Name ="GetUser")]
        public async Task<ActionResult<MemberDto>>GetUserByUsername(string username){
            //  var user=await userRepository.GetUserByUsernameAsync(username);
            //  var userToReturn=this.mapper.Map<MemberDto>(user);
            //  return userToReturn;
            return await userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult>UpdateUser(MemberUpdateDto member){
            var user=await userRepository.GetUserByUsernameAsync(User.GetUsername());
            mapper.Map(member,user);
            userRepository.Update(user);
            if(await userRepository.SaveAllAsync()){
                return Ok(new{
                    Message="The user is updated"
                });
            }
            return BadRequest(new{
                Message="The user is not updated"
            });
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>>AddPhoto(IFormFile file){

           var username=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
           var user= await userRepository.GetUserByUsernameAsync(username);

           var result=await photoService.AddPhotoAsync(file);

           if(result.Error!=null){
             return BadRequest(result.Error.Message);
           }

           var photo=new Photo{
            Url=result.SecureUrl.AbsoluteUri,
            PublicId=result.PublicId
           };

           if(user.Photos.Count==0){
            photo.IsMain=true;
           }

           user.Photos.Add(photo);
           if( await userRepository.SaveAllAsync()){
            //   return mapper.Map<PhotoDto>(photo);
            return CreatedAtRoute("GetUser",new{username=user.Username},mapper.Map<PhotoDto>(photo));
           }

           return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult>SetMainPhoto(int photoId){
           
           var username=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
           var user=await userRepository.GetUserByUsernameAsync(username);
           var photo=user.Photos.FirstOrDefault(d=>d.Id==photoId);

           if(photo.IsMain){
            return BadRequest("The photo is already the main one");
           }

           var currentMain=user.Photos.FirstOrDefault(d=>d.IsMain);
           if(currentMain!=null){
            currentMain.IsMain=false;
            photo.IsMain=true;
           }

           if(await userRepository.SaveAllAsync()){
            return NoContent();
           }

           return BadRequest("Setting the main photo failed");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId){
            
            var username=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user=await userRepository.GetUserByUsernameAsync(username);
            var photo=user.Photos.FirstOrDefault(d=>d.Id==photoId);

            if(photo==null){
                return NotFound();
            }

            if(photo.IsMain){
                return BadRequest("You cannot delete you main photo");
            }

            if(photo.PublicId!=null){
                var result= await photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error!=null){
                    return BadRequest(result.Error.Message);
                }
            }

            user.Photos.Remove(photo);
            if(await userRepository.SaveAllAsync()){
                return Ok(new{
                    Message="Photo is deleted"
                });
            }

            return BadRequest("Error deleting photo");
        }
    }
}