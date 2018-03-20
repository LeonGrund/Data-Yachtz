using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DataYachtz.Startup))]
namespace DataYachtz
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
