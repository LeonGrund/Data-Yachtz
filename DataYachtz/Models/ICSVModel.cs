using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataYachtz.Models
{
    public interface ICSVModel
    {
        ICSVModel GetNew();
        IdentityDbContext<ApplicationUser> GetDbContext();
        void SetProperty(string propName, object propValue);
        object GetProperty(string propName);
    }
}
