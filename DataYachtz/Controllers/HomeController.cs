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
using MVCGrid.Web.Models;
using DataYachtz;
using LumenWorks.Framework.IO.Csv;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Linq.Dynamic;


namespace DataYachtz.Controllers
{
    public class HomeController : Controller
    {


        public ActionResult LoadDataDate()
        {
            //var items = GetItems("", "", "");
            return View();
        }

        // With server side search Sorting with DatePicker
        [HttpPost]
        public ActionResult LoadDataWithDate()
        {
            var For = Request.Form;

           // var isNameSortable = true;//Convert.ToBoolean(Request["bSortable_1"]);
           // var isAddressSortable = true; //Convert.ToBoolean(Request["bSortable_2"]);
            //var isTownSortable = true; //Convert.ToBoolean(Request["bSortable_3"]);

            var Draw = Request.Form.GetValues("draw").FirstOrDefault();
            var Start = Request.Form.GetValues("start").FirstOrDefault();
            var Length = Request.Form.GetValues("length").FirstOrDefault();

            var SortColumn = Request.Form.GetValues("columns[" + Request.Form.GetValues("order[0][column]").FirstOrDefault() + "][data]").FirstOrDefault();
            var SortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
           
            var PartNo = Request.Form.GetValues("columns[0][search][value]").FirstOrDefault();
            var Spec = Request.Form.GetValues("columns[1][search][value]").FirstOrDefault();
            var Desc = Request.Form.GetValues("columns[2][search][value]").FirstOrDefault();
            var CreatedDate = Request.Form.GetValues("columns[3][search][value]").FirstOrDefault();
            DateTime CDate = DateTime.MinValue;
            if (CreatedDate != "")
                CDate = Convert.ToDateTime(CreatedDate).Date;

            int PageSize = Length != null ? Convert.ToInt32(Length) : 0;
            int Skip = Start != null ? Convert.ToInt32(Start) : 0;
            int TotalRecords = 3;

            //List<ItemMasterModel> Models;
            // using (var entities = new ApplicationDbContext()) {
            //Models = entities.ItemMasterDatabase.Select(X => X).ToList(); }
            IEnumerable<ItemMasterModel> Items;
            IEnumerable<ItemMasterModel> NewItems;
            object data;

            using (var dbs = new ApplicationDbContext()) { 
            Items = (from a in dbs.ItemMasterDatabase.Where(x => 
                x.Description.Contains(Desc) &&
                x.Specification.Contains(Spec) &&
                x.PartNumber.Contains(PartNo))
               
                //x.CreatedDate.Date >= CDate.Date)
                .Take(4000)
                         select new ItemMasterModel
                         {
                             PartNumber = a.PartNumber,
                             Specification = a.Specification,
                             Description = a.Description,
                             CreatedDate = a.CreatedDate
                         });

                if (!(string.IsNullOrEmpty(SortColumn) && string.IsNullOrEmpty(SortColumnDir)))
                {
                    Items = Items.OrderBy(SortColumn + " " + SortColumnDir);
                }
                NewItems = Items.Select(x => x);
                //TotalRecords = Items.Count();
                //NewItems = Items.Skip(Skip).Take(PageSize).ToList();
                data = new { draw = Draw, recordsFiltered = TotalRecords, recordsTotal = TotalRecords, data = NewItems.ToList<ItemMasterModel>() };
                
            }
   
            return Json(data, JsonRequestBehavior.AllowGet);
        }



        private ApplicationDbContext _dbContext;
      
        public HomeController()
        {
            _dbContext = new ApplicationDbContext();
        }

        // GET: UserCSVs
        public ActionResult About()
        {
           // var users = _dbContext.UserCSVDatabase.ToList();
            return View();
        }

        public ActionResult Upload()
        {
            return View();
        }

        /*
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

                        UserCSVModel csvDataModel = new UserCSVModel();    //CREATE MODEL
                        //var csvDataList = new List<string>();           // List for the model

                        using (CsvReader csvReader =
                            new CsvReader(new StreamReader(stream), true))
                        {
                            csvDataTable.Load(csvReader);
                         
                        }

                        string[] csvColNames = csvDataTable.Columns.Cast<DataColumn>()
                             .Select(x => x.ColumnName)
                             .ToArray();



                        var ddd =  DataTableToDatabase(csvDataTable, csvDataModel, csvColNames);
                        AddRowsToTable(ddd);

                        using (ApplicationDbContext entities = new ApplicationDbContext())
                        {
                            entities.UserCSVDatabase.Add(csvDataModel);
                            entities.SaveChanges();
                        }

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

        public List<ICSVModel> DataTableToDatabase(DataTable table, ICSVModel model, String[] colNames)
        {
            var retModelList = new List<ICSVModel>();
            
            int colNo = 0;
            
            foreach (var row in table.Rows)
            {              
                var _model = model.GetNew();
                foreach (var colName in colNames)
                {
                    _model.SetProperty(colName, table.Rows[colNo][colName].ToString());       
                }
                colNo++;
                retModelList.Add(_model);
            }

            return retModelList;
        }

        public void AddRowsToTable(List<ICSVModel> modelList)
        {
            foreach (var model in modelList)
            {
                using (var entities = model.GetDbContext()) //new ApplicationDbContext()) //new ApplicationDbContext())            
                {
                    var entitiesOld = new ApplicationDbContext();
                    entitiesOld.UserCSVDatabase.Add((UserCSVModel)model);

                    entities.db.Add((UserCSVModel)model);
                    entities.SaveChanges();
                }
            }
          
        }
        */
        
        public ActionResult PublicUpload()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult PublicUpload(HttpPostedFileBase upload)
        {
            if (ModelState.IsValid)
            {

                if (upload != null && upload.ContentLength > 0)
                {

                    if (upload.FileName.EndsWith(".csv"))
                    {
                        Stream stream = upload.InputStream;
                        DataTable csvDataTable = new DataTable();

                        PublicUserCSVModel model = new PublicUserCSVModel();
                        model.Name = upload.FileName;

                       
                        using (CsvReader csvReader =
                            new CsvReader(new StreamReader(stream), true))
                        {
                            csvDataTable.Load(csvReader);

                        }

                        string[] csvColNames = csvDataTable.Columns.Cast<DataColumn>()
                             .Select(x => x.ColumnName)
                             .ToArray();

                        model.ColName = csvColNames.ToList();

                        // Populating PublicUserCSVModel
                        var table = new List<List<string>>(); // each list is a col with [0]=name of col
                        foreach (var colName in csvColNames)
                        {                  
                            string[] ColItems = csvDataTable.AsEnumerable()
                            .Select(s => s.Field<string>(colName)).ToArray<string>();

                            var ret = ColItems.ToList();
                            ret.Insert(0, colName);

                            table.Add(ret);
                        }

                        model.Table = table;

                        //  var csvGrid = new MVCGridConfig();
                        //csvGrid.Model = model;     // set model in grid class
                        //var works = DataYachtz.MVCGridConfig.Model.GetList(2);
                        //  csvGrid.RegisterGrids();
                        //DataYachtz.MVCGridConfig.Model = model;
                        //var grid = new MVCGridToolbarModel(model.Name);

                        TempData["PublicUpload"] = model;
                       

                        return RedirectToAction("WebGrid");
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

        public ActionResult WebGrid()
        {
            ProductModel model = new ProductModel();
            PublicUserCSVModel csvModel = new PublicUserCSVModel();

            if (TempData.ContainsKey("PublicUpload"))
            {

                csvModel = (PublicUserCSVModel)TempData["PublicUpload"];   //latest uploaded csv
                Session["PublicUpload"] = csvModel;

            }

            if (Session.Keys.Equals("PublicUpload")){
  
                List<Product> products = new List<Product>();

                using (var entities = new ApplicationDbContext())
                {
                    //entities.UserCSVDatabase.Where(r => r.Id >= 1).Select(r => products.Add(r));
                    var prod = from p in entities.UserCSVDatabase select p;
                    products = prod.ToList();
                }


                if (products != null && products.Count > 0)
                {
                    model.CreateGrid(products);
                }
            }
            
          

            return View(model);
        }

        [HttpPost]
        public ActionResult WebGrid(ProductModel  model)
        {

            return View(model);
        }

            // HOW TO ADD ROW TO DB TABLE
            /*
            public ActionResult Index(UserCSVModel customer)
            {
                using (ApplicationDbContext entities = new ApplicationDbContext())
                {
                    entities.UserCSVDatabase.Add(customer);
                    entities.SaveChanges();
                }

                var users = _dbContext.UserCSVDatabase.ToList(); 
                return View(users);
            }*/

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
