using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.DTO
{
    public class RegisterDto
    {
        [Required]
        public string Username {get;set;}
        [Required]
        [StringLength(8,MinimumLength =4)]
        public string Password {get;set;}
    }
}