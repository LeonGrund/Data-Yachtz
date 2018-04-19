using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DataYachtz_PLC.Models
{
    public class ItemMasterModel
    {
        [Key]
        public string PartNumber { get; set; }
        public string Specification { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CsvModel
    {
        public String[] ColumnNames { get; set; }

        public CsvModel()
        {
            

        }

        
    }
}