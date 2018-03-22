using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DataYachtz.Models
{
    public class UserCSVModels
    {
        public List<string> DataList{ get; set; }
        public int Id { get; set; }
        public string Email { get; set; }
        public string CSV { get; set; }
    }
}