using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.DTO;
using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _db;
        public readonly ITokenService tokenService;

        public AccountController(DataContext db,ITokenService tokenService){
           this._db=db;
           this.tokenService=tokenService;
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

          var user=new AppUser{
            Username=register.Username.ToLower(),
            PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(register.Password)),
            PasswordSalt=hmac.Key
          };

          await this._db.Users.AddAsync(user);
          await this._db.SaveChangesAsync();

          var userDto=new UserDto{
            Username=user.Username,
            Token=this.tokenService.CreateToken(user)
          };

          return Ok(new{
            token=userDto.Token,
            username=userDto.Username,
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

            var user=await this._db.Users.FirstOrDefaultAsync(d=>d.Username==login.Username.ToLower());
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
               Token=this.tokenService.CreateToken(user)
            };

            return Ok(new{
               token=userDto.Token,
               username=userDto.Username,
               Message="Login successeded"
            });
       }
    }
}