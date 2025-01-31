using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.DTO;
using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _db;
        private readonly IMapper mapper;
        public UserRepository(DataContext db,IMapper mapper){
           _db=db;
           this.mapper=mapper;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _db.Users.Where(d=>d.Username==username)
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams user)
        {
            // var users=_db.Users.ProjectTo<MemberDto>(this.mapper.ConfigurationProvider).AsNoTracking().AsQueryable();
            var users=_db.Users.AsQueryable();
            users=users.Where(d=>d.Username!=user.CurrentUsername);
            users=users.Where(d=>d.Gender==user.Gender);
            var minDob=DateTime.Today.AddYears(-user.MaxAge-1);
            var maxDob=DateTime.Today.AddYears(-user.MinAge);
            users=users.Where(d=>d.DateOfBirth>=minDob && d.DateOfBirth<=maxDob);
            
            users=user.OrderBy switch{
                "Created"=>users.OrderByDescending(d=>d.Created),
                _=>users.OrderByDescending(d=>d.LastActive)
            };
            
            var obj= await PagedList<MemberDto>.CreateAsync(users.ProjectTo<MemberDto>(this.mapper.ConfigurationProvider).AsNoTracking(),user.PageNumber,user.PageSize);
            return obj;
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
             return await this._db.Users.FirstOrDefaultAsync(d=>d.Id==id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await this._db.Users.Include(p=>p.Photos).FirstOrDefaultAsync(d=>d.Username==username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await this._db.Users.Include(p=>p.Photos).ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await this._db.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            if(user==null){
                throw new ArgumentNullException(nameof(user), "User cannot be null");
            }
            // this._db.Users.Update(user);
            // this._db.Users.Attach(user).State=EntityState.Modified;
            this._db.Entry(user).State=EntityState.Modified;
        }


        
    }
}