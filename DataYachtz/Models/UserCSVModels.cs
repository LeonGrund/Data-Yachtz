using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace DataYachtz.Models
{
    //TODO: Auto gen new model for each csv db table added
    public class UserCSVModel : ICSVModel
    {
        
        public class UserCSVModelDbContext : IdentityDbContext<ApplicationUser>
        {
            //TODO: Auto gen code for new csv db table added
            public DbSet<UserCSVModel> db { get; set; }


            public UserCSVModelDbContext()
                : base("DefaultConnection", throwIfV1Schema: false)
            {
            }

            public static ApplicationDbContext Create()
            {
                return new ApplicationDbContext();
            }
        }

        /*public UserCSVModel()
        {
            Db = GetDbContext().db;
            
        }*/

        public int Id { get; set; }
        public string Email { get; set; }
        public string CSV { get; set; }

       // public DbSet<UserCSVModel> Db { get; set; }

       // public DbSet<UserCSVModel> GetDb => UserCSVModelDbContext.db;
        public ICSVModel GetNew() => new UserCSVModel();
        public IdentityDbContext<ApplicationUser> GetDbContext() => new UserCSVModelDbContext();

        public void SetProperty(string propName, object propValue)
        {
            switch (propName.ToLower())
            {
                case "id":
                    Id = Convert.ToInt32(propValue);
                    break;
                case "email":
                    Email = (string)propValue;
                    break;
                case "csv":
                    CSV = (string)propValue;
                    break;
                default: throw new ArgumentException(propName);
            }
        }

        public object GetProperty(string propName)
        {
            switch (propName.ToLower())
            {
                case "id": return Id;
                case "email": return Email;
                case "csv": return CSV;
                default: throw new ArgumentException(propName);
            }
        }
    }
}