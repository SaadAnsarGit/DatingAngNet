using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.DTO;
using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _db;
        public readonly ITokenService tokenService;
        private readonly IMapper _mapper;

        public AccountController(DataContext db,ITokenService tokenService,IMapper mapper){
           this._db=db;
           this.tokenService=tokenService;
           _mapper=mapper;
        }

       [HttpPost("Register")]
       public async Task<IActionResult> UserSignIn(RegisterDto register){

         if(register.Username==null){
            return NotFound("The username is not Found");
         }

          using var hmac=new HMACSHA256();

          bool result= await this.UserExist(register.Username);

          if(result){
             return BadRequest(new{
                Message="The username is already exists"
             });
          }

            var user= _mapper.Map<AppUser>(register);
            user.Username=register.Username.ToLower();
            user.PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(register.Password));
            user.PasswordSalt=hmac.Key;
          
          await this._db.Users.AddAsync(user);
          await this._db.SaveChangesAsync();

          var userDto=new UserDto{
            Username=user.Username,
            Token=this.tokenService.CreateToken(user),
            KnownAs=user.KnownAs,
            Gender=user.Gender
          };

          return Ok(new{
            token=userDto.Token,
            username=userDto.Username,
            knownAs=user.KnownAs,
            gender=userDto.Gender,
            Message="The register is done",
          });

       } 

       private async Task<bool> UserExist(string username){
         
          return await this._db.Users.AnyAsync(d=>d.Username==username.ToLower());

       }

       [HttpPost("Login")]
       public async Task<IActionResult> UserLogin(LoginDto login){
            
            if(login.Username==null || login.Password==null){
               return BadRequest(new{

                  Message="The request is invalid"
               });
            }

            var user=await this._db.Users.Include(p=>p.Photos).FirstOrDefaultAsync(d=>d.Username==login.Username.ToLower());
            if(user==null){
               return NotFound(new{
                  Message="The user is not found"
               });
            }

            using var hmac=new HMACSHA256(user.PasswordSalt);
            var computedHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(login.Password));

            for(int i=0;i<computedHash.Length;i++){
               if(computedHash[i]!=user.PasswordHash[i]){
                  return Unauthorized("The password is not correct");
               }
            }

            
            var userDto=new UserDto{
               Username=user.Username,
               Token=this.tokenService.CreateToken(user),
               PhotoUrl=user.Photos.FirstOrDefault(d=>d.IsMain)?.Url,
               KnownAs=user.KnownAs,
               Gender=user.Gender
            };

            return Ok(new{
               token=userDto.Token,
               username=userDto.Username,
               photoUrl=userDto.PhotoUrl,
               gender=userDto.Gender,
               Message="Login successeded"
            });
       }
    }
}