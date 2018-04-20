using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
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
        public List<Cell> Data { get; set; }
       

        public CsvModel()
        {
            Data = new List<Cell>();
            ColumnNames = new string[] { "PartNumber", "Specification", "Description", "CreatedDate" };

            
        }

        public int GetSize() => ColumnNames.Count();
        public void AddCell(Cell c) => Data.Add(c);
     
    }

    public class Cell
    {
        private Dictionary<string, string> Info;

        public Cell(String[] columnNames)
        {
            Info = new Dictionary<string, string>();
            foreach (var col in columnNames)
            {
                Info.Add(col, "");
            }

            
        }

        public void SetCellInfo(string columnName, string info) => Info[columnName] = info;
        public string GetCellInfo(string columnName) => Info[columnName];
    }

}