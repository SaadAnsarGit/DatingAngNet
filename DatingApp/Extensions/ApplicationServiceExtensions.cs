using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.Interfaces;
using DatingApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Extensions
{
    public static class ApplicationServiceExtensions
    {
         public static IServiceCollection AddAplicationServices(this IServiceCollection services,IConfiguration configuration ){
            services.AddScoped<ITokenService,TokenService>();
            services.AddDbContext<DataContext>(options=>{
            options.UseSqlServer(configuration.GetConnectionString("DevConnection"));
            options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
        });

           return services;
        }
    }
}