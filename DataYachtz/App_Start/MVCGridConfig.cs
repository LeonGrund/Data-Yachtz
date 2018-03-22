[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(DataYachtz.MVCGridConfig), "RegisterGrids")]

namespace DataYachtz
{
    using System;
    using System.Web;
    using System.Web.Mvc;
    using System.Linq;
    using System.Collections.Generic;
    using Models;
    using MVCGrid.Models;
    using MVCGrid.Web;
    using System.Data.Entity;
    using DataYachtz.Controllers;

    public static class MVCGridConfig 
    {
        public static void RegisterGrids()
        {
            
            MVCGridDefinitionTable.Add("UsageExample", new MVCGridBuilder<UserCSVModels>()
                .WithAuthorizationType(AuthorizationType.AllowAnonymous)
                .WithSorting(sorting: true, defaultSortColumn: "Id", defaultSortDirection: SortDirection.Dsc)
                .WithPaging(paging: true, itemsPerPage: 10, allowChangePageSize: true, maxItemsPerPage: 100)
                .WithAdditionalQueryOptionNames("search")
                .AddColumns(cols =>
                {
                    cols.Add("Id").WithValueExpression((p, c) => c.UrlHelper.Action("detail", "demo", new { id = p.Id }))
                        .WithValueTemplate("<a href='{Value}'>{Model.Id}</a>", false)
                        .WithPlainTextValueExpression(p => p.Id.ToString());
                    cols.Add().WithColumnName("Email")
                        .WithHeaderText("Email")
                        .WithVisibility(true, true)
                        .WithValueExpression(i => i.Email); // use the Value Expression to return the cell text for this column
                    cols.Add().WithColumnName("CSV")
                        .WithHeaderText("CSV")
                        .WithVisibility(true, true)
                        .WithValueExpression(i => i.CSV);
                })
                .WithRetrieveDataMethod((context) =>
                {
                    // Query your data here. Obey Ordering, paging and filtering parameters given in the context.QueryOptions.
                    // Use Entity Framework, a module from your IoC Container, or any other method.
                    // Return QueryResult object containing IEnumerable<YouModelItem>
                    var options = context.QueryOptions;
                    int totalRecords;
                    var repo = HomeController._dbContext.UserCSVs.ToList();   //DependencyResolver.Current.GetService<UserCSVModels>();
                    string globalSearch = options.GetAdditionalQueryOptionString("search");
                    string sortColumn = options.GetSortColumnData<string>();
                    var items = repo;//.GetData(out totalRecords, globalSearch, options.GetLimitOffset(), options.GetLimitRowcount(),
                        //sortColumn, options.SortDirection == SortDirection.Dsc);
                    
                    return new QueryResult<UserCSVModels>()
                    {
                        //Items = HomeController._dbContext.UserCSVs.ToList(),
                        Items = items,
                        TotalRecords = 3 //totalRecords

                        //TotalRecords = 0 // if paging is enabled, return the total number of records of all pages
                    };

                })
            ); 
            
        }
    }
}