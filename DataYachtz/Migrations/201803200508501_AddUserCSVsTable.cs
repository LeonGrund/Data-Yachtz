namespace DataYachtz.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserCSVsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserCSVModels",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Email = c.String(),
                        CSV = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.UserCSVModels");
        }
    }
}
