namespace DataYachtz.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class webGrid : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.UserCSVModels", newName: "Products");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.Products", newName: "UserCSVModels");
        }
    }
}
