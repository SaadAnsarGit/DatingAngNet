using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.Extensions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext=await next();

            if(!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId=resultContext.HttpContext.User.GetUserId();
            var repository=resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
            var user=await repository.GetUserByIdAsync(userId);
            user.LastActive=DateTime.Now;
            await repository.SaveAllAsync();
        }
    }
}