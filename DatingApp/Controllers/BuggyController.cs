
using DatingApp.Data;
using DatingApp.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuggyController : ControllerBase
    {
        
        private readonly DataContext _db;

        public BuggyController(DataContext db){
           this._db=db;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret(){

            return "secret text";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound(){

           var thing=this._db.Users.Find(-1);
           
           if(thing==null){
              return NotFound("the user is not found");
           }
           
            return Ok(thing);
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError(){

               var thing=this._db.Users.Find(-1);
               var thingToReturn= thing.ToString();
               return thingToReturn;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest(){

            return BadRequest("this is a bad request");
        }


    }
}