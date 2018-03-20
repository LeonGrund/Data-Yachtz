using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataYachtz.Models;

namespace DataYachtz.Controllers
{
    public class HomeController : Controller
    {
        public static ApplicationDbContext _dbContext;

        public HomeController()
        {
            _dbContext = new ApplicationDbContext();
        }

        public ActionResult Index()
        {
            return View();
        }

        // GET: UserCSVs
        public ActionResult About()
        {
            var users = _dbContext.UserCSVs.ToList();
            return View(users);
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}






/*
             SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
             conn.Open();
             //SELECT * FROM [tSpecies] WHERE ([Status] = @Status OR @Status IS NULL)
             string queryUserName = "SELECT UserName FROM AspNetUsers WHERE Email = leon@gmail.com";
             SqlCommand passComm = new SqlCommand(queryUserName, conn);
             string result = passComm.ExecuteScalar().ToString();
             //int result = Convert.ToInt32(passComm.ExecuteScalar().ToString());
             conn.Close();

             ViewBag.Message = result;
             */
