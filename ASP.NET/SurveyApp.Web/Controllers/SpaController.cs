
using Microsoft.AspNetCore.Mvc;

namespace SurveyApp.Web.Controllers
{
    public class SpaController : Controller
    {
        [Route("/{**path:regex(^(?!api|lib|css|js|favicon\\.ico).*$)}")]
        public IActionResult Index()
        {
            return View("~/Views/Home/Index.cshtml");
        }
    }
}
