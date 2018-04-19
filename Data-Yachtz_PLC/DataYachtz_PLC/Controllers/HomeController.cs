using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using DataYachtz_PLC.Models;


namespace DataYachtz_PLC.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        private ApplicationDbContext GetEntities()
        {
            return new ApplicationDbContext();
        }






        private bool ContainsTime(DateTime modelDate, string searchDate)
        {
            bool equal = false;
            var mDate = Regex.Split(modelDate.ToString().Trim(), "/:");
            var sDate = searchDate.ToString().Trim().Split('-');

            foreach(var e in mDate)
            {
                foreach (var s in sDate)
                {
                    if (e.Contains(s)) { return true; break; }
                }
                if (equal) { break; }
            }
            return equal;
        }

        public ActionResult Index()
        {
            //var items = GetItems("", "", "");
            return View();
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

            var PartNo = Request.Form.GetValues("columns[0][search][value]").FirstOrDefault();
            var Spec = Request.Form.GetValues("columns[1][search][value]").FirstOrDefault();
            var Desc = Request.Form.GetValues("columns[2][search][value]").FirstOrDefault();
            var Date = Request.Form.GetValues("columns[3][search][value]").FirstOrDefault();
            var Global = Request.Form.GetValues("search[value]").FirstOrDefault();

            int PageSize = Length != null ? Convert.ToInt32(Length) : 0;
            int Skip = Start != null ? Convert.ToInt32(Start) : 0;
            int TotalRecords = 0;

            List<ItemMasterModel> Models;
            using (var entities = new ApplicationDbContext())
            {
                Models = entities.ItemMasters.Select( X => X).ToList();
            }

            var Items = (from a in Models
                             .Where(x => 
                             (x.Description.ToLower().Contains(Desc.ToLower()) && x.Specification.ToLower().Contains(Spec.ToLower()) && 
                             x.PartNumber.ToLower().Contains(PartNo.ToLower()) && ContainsTime(x.CreatedDate, Date)) &&

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

            return Json(new { draw = Draw, recordsFiltered = TotalRecords, recordsTotal = TotalRecords, data = NewItems }, JsonRequestBehavior.AllowGet);
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