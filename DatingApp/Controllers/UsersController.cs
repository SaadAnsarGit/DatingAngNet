using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.DTO;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        public UsersController(IUserRepository userRepository,IMapper mapper){
           this.userRepository=userRepository;
           this.mapper=mapper;
        }
        
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>>GetAllUsers(){

        //    var users=await this.userRepository.GetUsersAsync();
        //    var usersToReturn=this.mapper.Map<IEnumerable<MemberDto>>(users);
        //     return Ok(usersToReturn);
            return Ok(await userRepository.GetMembersAsync());
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>>GetUserByUsername(string username){
            //  var user=await userRepository.GetUserByUsernameAsync(username);
            //  var userToReturn=this.mapper.Map<MemberDto>(user);
            //  return userToReturn;
            return await userRepository.GetMemberAsync(username);
        }
    }
}