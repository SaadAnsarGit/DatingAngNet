using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.DTO
{
    public class UserDto
    {
        public string Username {get;set;}
        public string Token {get;set;}
        public string PhotoUrl {get;set;}
        public string KnownAs {get;set;}
        public string Gender {get;set;}
    }
}