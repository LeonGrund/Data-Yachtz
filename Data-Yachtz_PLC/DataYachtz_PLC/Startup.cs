using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DataYachtz_PLC.Startup))]
namespace DataYachtz_PLC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
