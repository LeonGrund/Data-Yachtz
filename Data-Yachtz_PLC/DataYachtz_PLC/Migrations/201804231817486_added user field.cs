namespace DataYachtz_PLC.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addeduserfield : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "CsvFileNames", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "CsvFileNames");
        }
    }
}
