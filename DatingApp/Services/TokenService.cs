using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;

namespace DatingApp.Services
{
    public class TokenService : ITokenService
    {
      
      private readonly SymmetricSecurityKey _key;
       public TokenService(IConfiguration configuration){
            
            this._key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"]));

       }

        public string CreateToken(AppUser user)
        {
            var claims=new List<Claim>{
                new Claim(JwtRegisteredClaimNames.NameId,user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName,user.Username),
            };

            var credentials=new SigningCredentials(this._key,SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor=new SecurityTokenDescriptor{
              Subject=new ClaimsIdentity(claims),
              Expires=DateTime.Now.AddDays(7),
              SigningCredentials=credentials
            };

            var tokenHandler=new JwtSecurityTokenHandler();
            var token=tokenHandler.CreateToken(tokenDescriptor);

             return tokenHandler.WriteToken(token);
        }
    }
}