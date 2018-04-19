using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;

namespace DataYachtz.Models
{
    //TODO: Auto gen new model for each csv db table added
    /*
    public class UserCSVModel : ICSVModel
    {

        public class ApplicationUser : IdentityUser
        {
            public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
            {
                var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);

                return userIdentity;
            }
        }

        public class UserCSVModelDbContext : IdentityDbContext<ApplicationUser>
        {
            public DbSet<UserCSVModel> db { get; set; }

            public UserCSVModelDbContext()
                : base("DefaultConnection", throwIfV1Schema: false)
            {
            }
            
            public static UserCSVModelDbContext Create()
            {
                return new UserCSVModelDbContext();
            }
           
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string CSV { get; set; }

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
    */
    public class UserCSVModel
    {
    }

    public class PublicUserCSVModel
    {
        public string Name { get; set; }
        public List<string> ColName { get; set; }
        public List<List<string>> Table { get; set; }

        public PublicUserCSVModel()
        {
            Name = "";
            Table = new List<List<string>>();
            ColName = new List<string> { "First", "Second", "Third" };
        }

        public List<List<string>> GetList(int colNO)
        {
            var ret = Table.GetRange(colNO - 1, colNO - 1);

            return ret;
        }

        public int GetCount() => Table.Count();


    }

    public class PUCSVModel
    {
        public List<PublicUserCSVModel> PUCSVList { get; set; }

        public PUCSVModel()
        {
            PUCSVList = new List<PublicUserCSVModel>();
        }

        public void AddPUCSV(PublicUserCSVModel model)
        {
            PUCSVList.Add(model);
        }
       
    }

    public class ProductModel
    {
        public int PageSize { get; set; }
        private int TotalCount { get; set; }
        public List<Product> Products { get; set; }
        public List<string> Columns { get; set; }
        public WebGrid Grid { get; set; }
        public WebGridColumn[] GridColumns{ get; set;}

        public ProductModel()
        {
            PageSize = 20;
            TotalCount = 4;
            Products = new List<Product>();
            Columns = new List<string>() { "Id", "Email", "CSV" };

           GridColumns = new WebGridColumn[Columns.Count];

            Grid = new WebGrid(null, rowsPerPage: PageSize);

            for (int i = 0; i < Columns.Count; i++)
            {
                var col = Grid.Column(Columns[i], Columns[i]);
                GridColumns[Columns.Count - 1 - i] = col;
            }

            Grid.Bind(Products, autoSortAndPage: true, rowCount: PageSize);
            Grid.GetHtml(tableStyle: "table table-bordered",
                    mode: WebGridPagerModes.All,
                    firstText: "<< First",
                    previousText: "< Prev",
                    nextText: "Next >",
                    lastText: "Last >>",
                    columns: GridColumns);
        }


        public void CreateGrid(List<Product> products)
        {
            Products = products;
            TotalCount = products.Count;    
           
            GridColumns = new WebGridColumn[Columns.Count];

            Grid = new WebGrid(null, rowsPerPage: PageSize);

            for (int i = 0; i < Columns.Count; i++)
            {
                var col = Grid.Column(Columns[i], Columns[i]);
                GridColumns[i] = col;
            }
       
            Grid.Bind(Products, autoSortAndPage: true, rowCount: PageSize);
            Grid.GetHtml(tableStyle: "table table-bordered",
                    mode: WebGridPagerModes.All,
                    firstText: "<< First",
                    previousText: "< Prev",
                    nextText: "Next >",
                    lastText: "Last >>",
                    columns: GridColumns);
                     
        }
       


    }


    public class Product
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string CSV { get; set; }
    }
}