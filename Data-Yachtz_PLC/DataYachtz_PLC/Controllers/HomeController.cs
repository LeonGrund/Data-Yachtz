using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using DataYachtz_PLC.Models;
using LumenWorks.Framework.IO.Csv;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace DataYachtz_PLC.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationUserManager _userManager;
        public CsvModel Model;

        public HomeController()
        {
            Model = new CsvModel();
     
        }

        public HomeController(ApplicationUserManager userManager)
        {
            UserManager = userManager;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        private void InitTestModel()
        {
            Model = new CsvModel();
            List<ItemMasterModel> Models;
            using (var entities = new ApplicationDbContext())
            {
                Models = entities.ItemMasters.Select(X => X).ToList();

                foreach (var model in Models)
                {
                    var cell = new Cell(Model.ColumnNames);
                    cell.SetCellInfo(Model.ColumnNames[0], model.PartNumber);
                    cell.SetCellInfo(Model.ColumnNames[1], model.Specification);
                    cell.SetCellInfo(Model.ColumnNames[2], model.Description);
                    cell.SetCellInfo(Model.ColumnNames[3], model.CreatedDate.ToString());
                    Model.AddCell(cell);
                }
            }
        }

        [Authorize]
        public async Task<ActionResult> CSVs()
        {
            var userEmail = User.Identity.GetUserName();
            var userEntity = await UserManager.FindByEmailAsync(userEmail);

            List<string> userCSVs = new List<string>();
            if (userEntity.CsvFileNames != null)
            {
                userCSVs = userEntity.CsvFileNames.Trim().Split(',').ToList();
            }
  
            return View(userCSVs);
        }

        public ActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Upload(HttpPostedFileBase upload)
        {
            if (ModelState.IsValid)
            {

                if (upload != null && upload.ContentLength > 0)
                {

                    if (upload.FileName.EndsWith(".csv"))
                    {
                        Stream stream = upload.InputStream;
                        DataTable csvDataTable = new DataTable();

                        var csvName = upload.FileName.Trim();

                        var userEmail = User.Identity.GetUserName();
                        if (userEmail != "")
                        {
                           
                            var userEntity = await UserManager.FindByEmailAsync(userEmail);
      
                            List<string> userCSVs = new List<string>();
                           
                            if (userEntity.CsvFileNames != null)
                            {
                                var csvString = userEntity.CsvFileNames.Trim();
                                
                                userCSVs = csvString.Split(',').ToList();
                                if (!userCSVs.Contains(csvName))
                                {
                                    var newCsv = "," + csvName;
                                    csvString += newCsv;

                                    userEntity.CsvFileNames = csvString;
                                    UserManager.Update(userEntity);
                                }  
                            }
                            else
                            {
                                // add the first CSV file name to user
                                userEntity.CsvFileNames = csvName;
                                UserManager.Update(userEntity);
                            }

                            // save CSV file
                            var path = Path.Combine(this.Request.PhysicalApplicationPath, csvName);
                            upload.SaveAs(path);
                        }
                       

                        var csvDataModel = new CsvModel();    //CREATE MODEL
                        //var csvDataList = new List<string>();           // List for the model

                        using (CsvReader csvReader =
                            new CsvReader(new StreamReader(stream), true))
                        {
                            csvDataTable.Load(csvReader);

                        }

                        // FOR SERVER SIDE SORTING etc
                        /*
                        string[] csvColNames = csvDataTable.Columns.Cast<DataColumn>()
                             .Select(x => x.ColumnName.Trim())
                             .ToArray();
                        csvDataModel.ColumnNames = csvColNames;

                        int rowNo = 0;
                        var columns = csvDataTable.Columns;

                        foreach (var row in csvDataTable.Rows)
                        {
                            var cell = new Cell(csvDataModel.ColumnNames);
                            int colNo = 0;
                            foreach (var colName in csvDataModel.ColumnNames)
                            {
                                var column = columns[colNo];
                                cell.SetCellInfo(colName, csvDataTable.Rows[rowNo][column].ToString());
                                colNo++;
                                //_model.SetProperty(colName, table.Rows[colNo][colName].ToString());
                            }
                            rowNo++;
                            csvDataModel.AddCell(cell);
                        }
                        */

                        //var ddd = DataTableToDatabase(csvDataTable, csvDataModel, csvColNames);
                        //AddRowsToTable(ddd);
                        /*
                        using (ApplicationDbContext entities = new ApplicationDbContext())
                        {
                            entities.UserCSVDatabase.Add(csvDataModel);
                            entities.SaveChanges();
                        }*/

                        /*
                        Model.SetColumNames(csvDataModel.ColumnNames);
                        Model.Data = csvDataModel.Data;
                        */

                        TempData["Model"] = csvDataTable;


                        return RedirectToAction("Index", new { csvName = csvName });
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

        private bool ContainsTime(DateTime modelDate, string searchDate)
        {
            bool equal = false;
            var mDate = Regex.Split(modelDate.ToString().Trim(), "/:");
            var sDate = searchDate.ToString().Trim().Split('-');

            foreach (var e in mDate)
            {
                foreach (var s in sDate)
                {
                    if (e.Contains(s)) { return true; break; }
                }
                if (equal) { break; }
            }
            return equal;
        }

       
        public ActionResult JQDataTableClients()
        {

            return View(Model);
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult Contact()
        {
            return View(Model);
        }
        private ApplicationDbContext GetEntities()
        {
            return new ApplicationDbContext();
        }

        [HttpGet]
        public PartialViewResult SomeAction()
        {
            return PartialView();
        }


        public ActionResult Index(string csvName)
        {
            ViewBag.Titel = csvName;

            //var items = GetItems("", "", "");
            if (TempData["Model"] != null)
            {
                return View(TempData["Model"]);
            }

            if (csvName != null)
            {
                //TODO: load csv with csvName
                //DataTable Model = new DataTable();
            }
          

            ViewBag.Titel = "Example CSV";

            // TODO: populate datatable model with example data
            DataTable Model = new DataTable();

            return View(Model);
        }




        // With server side search Sorting
        [HttpPost]
        public ActionResult LoadDataIndex()
        {
            var For = Request.Form;

            //var isNameSortable = Convert.ToBoolean(Request["bSortable_1"]);
            //var isAddressSortable = Convert.ToBoolean(Request["bSortable_2"]);
            //var isTownSortable = Convert.ToBoolean(Request["bSortable_3"]);

            var Draw = Request.Form.GetValues("draw").FirstOrDefault();
            var Start = Request.Form.GetValues("start").FirstOrDefault();
            var Length = Request.Form.GetValues("length").FirstOrDefault();

            var SortColumn = Request.Form.GetValues("columns[" + Request.Form.GetValues("order[0][column]").FirstOrDefault() + "][data]").FirstOrDefault();
            var SortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();


            // SEARCH INPUTS
            var SearchInput = new String[Model.GetSize()+1];
            for (int i = 0; i < Model.GetSize()-1; i++)
            {
                SearchInput[i] = Request.Form.GetValues("columns[" + i.ToString() + "][search][value]").FirstOrDefault();
            }
            SearchInput[Model.GetSize()] = Request.Form.GetValues("search[value]").FirstOrDefault();

            /*
            var PartNo = Request.Form.GetValues("columns[0][search][value]").FirstOrDefault();
            var Spec = Request.Form.GetValues("columns[1][search][value]").FirstOrDefault();
            var Desc = Request.Form.GetValues("columns[2][search][value]").FirstOrDefault();
            //var Date = Request.Form.GetValues("columns[3][search][value]").FirstOrDefault();
            var Global = Request.Form.GetValues("search[value]").FirstOrDefault();
            */

            int PageSize = Length != null ? Convert.ToInt32(Length) : 0;
            int Skip = Start != null ? Convert.ToInt32(Start) : 0;
            int TotalRecords = 4; //Model.Data.Count();

            List<ItemMasterModel> Models;
            using (var entities = new ApplicationDbContext())
            {
                Models = entities.ItemMasters.Select( X => X).ToList();
                
                foreach (var model in Models)
                {
                    var cell = new Cell(Model.ColumnNames);
                    cell.SetCellInfo(Model.ColumnNames[0], model.PartNumber);
                    cell.SetCellInfo(Model.ColumnNames[1], model.Specification);
                    cell.SetCellInfo(Model.ColumnNames[2], model.Description);
                    Model.AddCell(cell);
                }
            }


            /*
            var Items = (from a in Models
                           .Where(x =>
                           (x.Description.ToLower().Contains(Desc.ToLower()) && x.Specification.ToLower().Contains(Spec.ToLower()) &&
                           x.PartNumber.ToLower().Contains(PartNo.ToLower()) && ContainsTime(x.CreatedDate, "")) && //Date

                           (x.Description.ToLower().Contains(Global.ToLower()) || x.Specification.ToLower().Contains(Global.ToLower()) ||
                           x.PartNumber.ToLower().Contains(Global.ToLower())))


                           .Take(4000)
                         select new ItemMasterModel
                         {
                             PartNumber = a.PartNumber.Trim(),
                             Specification = a.Specification.Trim(),
                             Description = a.Description.Trim(),
                             CreatedDate = a.CreatedDate
                         }); 
            
            


            


            if (!(string.IsNullOrEmpty(SortColumn) && string.IsNullOrEmpty(SortColumnDir)))
            { //Items = Items.OrderBy(SortColumn + " " + SortColumnDir);

                switch (SortColumn)
                {
                    case "PartNumber":
                        if (SortColumnDir != "asc") { Items = Items.OrderByDescending(m => m.PartNumber);}
                        else { Items = Items.OrderBy(m => m.PartNumber); }
                        break;
                    case "Specification":
                        if (SortColumnDir != "asc") { Items = Items.OrderByDescending(m => m.Specification); }
                        else { Items = Items.OrderBy(m => m.Specification); }
                        break;
                    case "Description":
                        if (SortColumnDir != "asc") { Items = Items.OrderByDescending(m => m.Description); }
                        else { Items = Items.OrderBy(m => m.Description); }
                        break;
                    case "CreatedDate":
                        if (SortColumnDir != "asc") { Items = Items.OrderByDescending(m => m.CreatedDate); }
                        else { Items = Items.OrderBy(m => m.CreatedDate); }
                        break;
                    default:
                        Items = Items.OrderBy(m => m.PartNumber);
                        break;
                }
               
            }

            TotalRecords = Items.ToList().Count();
            var NewItems = Items.Skip(Skip).Take(PageSize).ToList();
            */
            //List<Cell> NewItems = Model.Data;

            return Json(new { draw = Draw, recordsFiltered = TotalRecords, recordsTotal = TotalRecords, data = Model.Data }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Items()
        {
            return View();
        }

        public ActionResult LoadData()
        {
            var Items = GetItems("", "", "");
            return Json(new { data = Items }, JsonRequestBehavior.AllowGet);
        }

        private List<ItemMasterModel> GetItems(string PartNo, string Spec, string Desc)
        {
            try
            {
                List<ItemMasterModel> Models;
                using (var entities = new ApplicationDbContext())
                {
                    Models = entities.ItemMasters.Select(X => X).ToList();
                }
        
                var Items = (from a in Models
                   .Where(x => x.Description.Contains(Desc) && x.Specification.Contains(Spec) && x.PartNumber.Contains(PartNo))
                             select new ItemMasterModel
                             {
                                 PartNumber = a.PartNumber,
                                 Specification = a.Specification,
                                 Description = a.Description,
                                 CreatedDate = a.CreatedDate
                             }).OrderByDescending(x => x.CreatedDate).ToList();

                ViewBag.Items = Items;
                return Items;
            }
            catch (Exception ex)
            {
                string Msg = ex.Message;
                return null;
            }
        }






    }
}