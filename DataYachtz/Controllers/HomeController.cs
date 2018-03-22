using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using DataYachtz.Models;
using LumenWorks.Framework.IO.Csv;

namespace DataYachtz.Controllers
{
    public class HomeController : Controller
    {
        public static ApplicationDbContext _dbContext;

        public HomeController()
        {
            _dbContext = new ApplicationDbContext();
        }

        // GET: UserCSVs
        public ActionResult About()
        {
            var users = _dbContext.UserCSVs.ToList();
            return View(users);
        }

        // CONVERT DataTable to List
        private static List<T> ConvertDataTable<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        private static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName)
                        pro.SetValue(obj, dr[column.ColumnName], null);
                    else
                        continue;
                }
            }
            return obj;
        }


        public ActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Upload(HttpPostedFileBase upload)
        {
            if (ModelState.IsValid)
            {

                if (upload != null && upload.ContentLength > 0)
                {

                    if (upload.FileName.EndsWith(".csv"))
                    {
                        Stream stream = upload.InputStream;
                        DataTable csvDataTable = new DataTable();

                        UserCSVModels csvData = new UserCSVModels();    //CREATE MODEL
                        var csvDataList = new List<string>();

                        using (CsvReader csvReader =
                            new CsvReader(new StreamReader(stream), true))
                        {
                            csvDataTable.Load(csvReader);
                         
                        }


                      //  csvData.CsvList = ConvertDataTable<CsvModel>(csvData.CsvTable);
                       // CsvList = ConvertDataTable<CsvModel>(csvData.CsvTable);


                        return View(csvDataTable);
                    }
                    else
                    {
                        ModelState.AddModelError("File", "This file format is not supported");
                        return View();
                    }
                }
                else
                {
                    ModelState.AddModelError("File", "Please Upload Your file");
                }
            }
            return View();
        }


        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Contact()
        {
            //ViewBag.Message = "Your contact page.";
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
