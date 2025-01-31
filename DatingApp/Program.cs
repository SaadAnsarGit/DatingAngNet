using System.Text;
using DatingApp.Data;
using DatingApp.Extensions;
using DatingApp.Interfaces;
using DatingApp.Middleware;
using DatingApp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using Microsoft.Extensions.Logging;
using DatingApp.Helpers;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ITokenService,TokenService>();
builder.Services.AddScoped<LogUserActivity>();

builder.Services.AddDbContext<DataContext>(options=>{
  options.UseSqlServer(builder.Configuration.GetConnectionString("DevConnection"));
});

builder.Services.AddAplicationServices(builder.Configuration);

builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddCors(option =>
{
    option.AddPolicy("MyPolicy", builder =>
    {
        builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});


// Configure the HTTP request pipeline.

var app = builder.Build();

using var scope=app.Services.CreateScope();
var services=scope.ServiceProvider;

try{
   var context=services.GetRequiredService<DataContext>();
   await context.Database.MigrateAsync();
   await Seed.SeedUsers(context);
}
catch(Exception ex){
  var logger=services.GetRequiredService<ILogger<Program>>();
  logger.LogError(ex,"An error occured during migration");
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();

app.UseCors("MyPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
