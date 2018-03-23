using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DataYachtz.Models
{
    //TODO: Auto gen new model for each csv db table added
    public class UserCSVModel
    {
        /*
        public UserCSVModel()
        {
            DataList = new List<string>();
        }*/

        public List<string> DataList{ get; set; }
        public int Id { get; set; }
        public string Email { get; set; }
        public string CSV { get; set; }
    }
}