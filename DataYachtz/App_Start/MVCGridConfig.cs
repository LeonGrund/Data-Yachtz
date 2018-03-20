[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(DataYachtz.MVCGridConfig), "RegisterGrids")]

namespace DataYachtz
{
    using System;
    using System.Web;
    using System.Web.Mvc;
    using System.Linq;
    using System.Collections.Generic;

    using MVCGrid.Models;
    using MVCGrid.Web;
    using System.Data.Entity;
    using DataYachtz.Models;
    using DataYachtz.Controllers;

    public static class MVCGridConfig 
    {
        public static void RegisterGrids()
        {
            
            MVCGridDefinitionTable.Add("UsageExample", new MVCGridBuilder<UserCSVModels>()
                .WithAuthorizationType(AuthorizationType.AllowAnonymous)
                .AddColumns(cols =>
                {
                    // Add your columns here
                    cols.Add().WithColumnName("Email")
                        .WithHeaderText("EMAIL")
                        .WithValueExpression(i => i.Email); // use the Value Expression to return the cell text for this column
                    cols.Add().WithColumnName("CSV")
                        .WithHeaderText("CSV")
                         .WithValueExpression(i => i.Email);
                })
                .WithRetrieveDataMethod((context) =>
                {
                    // Query your data here. Obey Ordering, paging and filtering parameters given in the context.QueryOptions.
                    // Use Entity Framework, a module from your IoC Container, or any other method.
                    // Return QueryResult object containing IEnumerable<YouModelItem>
                    
                    return new QueryResult<UserCSVModels>()
                    {
                        Items = HomeController._dbContext.UserCSVs.ToList(),
                        TotalRecords = 0 // if paging is enabled, return the total number of records of all pages
                    };

                })
            ); 
            
        }
    }
}