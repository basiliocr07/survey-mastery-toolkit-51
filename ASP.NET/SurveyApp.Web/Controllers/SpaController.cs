
using Microsoft.AspNetCore.Mvc;

namespace SurveyApp.Web.Controllers
{
    public class SpaController : Controller
    {
        [HttpGet]
        [Route("/{*path:nonfile}")]
        public IActionResult Index()
        {
            return View("~/Views/Home/Index.cshtml");
        }
    }
}
