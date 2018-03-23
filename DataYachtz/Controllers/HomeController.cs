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
            //var test = _dbContext.BulkImportDetails.ToList();
            return View(users);
        }

        /*
        // CONVERT DataTable to List
        private static List<string> ConvertDataTable(DataTable dt)
        {
            List<DataRow> RowList = dt.AsEnumerable().ToList();

            //List<List<string>> data = new List<List<string>>();

            List<string> tempRow = new List<string>();

            foreach (DataRow row in RowList)
              
                foreach (var col in row.ToString())
                {
                    tempRow.Add(col.ToString());
                }

            //data.Add(tempRow);
        
           

            return tempRow;
        }
       */


        public ActionResult Upload()
        {
           // var ret = new List<string>();

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

                        UserCSVModels csvDataModel = new UserCSVModels();    //CREATE MODEL
                        var csvDataList = new List<string>();           // List for the model

                        using (CsvReader csvReader =
                            new CsvReader(new StreamReader(stream), true))
                        {
                            csvDataTable.Load(csvReader);
                         
                        }

                        //csvDataList = ConvertDataTable(csvDataTable);   //convert to List
                        csvDataModel.DataList = csvDataList;                    // store in model

          


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
