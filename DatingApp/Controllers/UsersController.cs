using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _db;

        public UsersController(DataContext db){
           this._db=db;
        }
        
        [HttpGet("getUsers")]
        public async Task<IActionResult>GetAllUsers(){

            return Ok(await this._db.Users.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult>getUser(int id){

            var user=await this._db.Users.FirstOrDefaultAsync(d=>d.Id==id);
            if(user==null){
                return BadRequest(new{
                    Message="The request is not valid"
                });
            }

            return Ok(new{
                user=user
            });

        }
    }
}