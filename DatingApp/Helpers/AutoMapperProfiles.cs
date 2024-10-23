using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.DTO;
using DatingApp.Entities;
using DatingApp.Extensions;
using Microsoft.Data.SqlClient;

namespace DatingApp.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles(){
            CreateMap<AppUser,MemberDto>()
            .ForMember(destination=>destination.PhotoUrl,option=>option.MapFrom(src=>src.Photos.FirstOrDefault(d=>d.IsMain).Url))
            .ForMember(d=>d.Age,opt=>opt.MapFrom(p=>p.DateOfBirth.calculateAge()));
            // CreateMap<Photo,PhotoDto>();
        }
    }
}