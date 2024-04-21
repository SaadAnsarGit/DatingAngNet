using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Text.Json;
using System.Threading.Tasks;
using DatingApp.Errors;
using Microsoft.AspNetCore.Http;

namespace DatingApp.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next,ILogger<ExceptionMiddleware> logger,IHostEnvironment env){
            this._next=next;
            this._logger=logger;
            this._env=env;
        }

        public async Task InvokeAsync(HttpContext context){

            try{
                await this._next(context);
            }
            catch(Exception ex){
               this._logger.LogError(ex,ex.Message);
               context.Response.ContentType="application/json";
               context.Response.StatusCode=(int)HttpStatusCode.InternalServerError;

               var response=this._env.IsDevelopment()
               ? new ApiException(context.Response.StatusCode,ex.Message,ex.StackTrace?.ToString())
               : new ApiException(context.Response.StatusCode,"Internal server error");

               var options=new JsonSerializerOptions{PropertyNamingPolicy=JsonNamingPolicy.CamelCase};
               var json=JsonSerializer.Serialize(response,options);

               await context.Response.WriteAsync(json);
               // This is a MiddleWare !!!
            }
        }
    }
}