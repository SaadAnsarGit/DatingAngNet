using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using DatingApp.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext db){
          if(await db.Users.AnyAsync()){
              return ;
          }
          
          var userData=await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
          var users=JsonSerializer.Deserialize<List<AppUser>>(userData);

          foreach(var user in users){

           using var hmac=new HMACSHA256();
           user.Username=user.Username.ToLower();
           user.PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
           user.PasswordSalt=hmac.Key;

            await db.Users.AddAsync(user);
          }

           await db.SaveChangesAsync();
        }
    }
}