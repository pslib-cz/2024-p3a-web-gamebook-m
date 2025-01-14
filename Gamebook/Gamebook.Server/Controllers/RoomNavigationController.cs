using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Routing;

namespace Gamebook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomNavigateController : ControllerBase
    {

        [HttpGet]
        public IActionResult GetControllersAndActions()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var controllers = assembly.GetTypes()
                .Where(type => typeof(ControllerBase).IsAssignableFrom(type) && type.Name.EndsWith("Controller"))
                 .ToList();

            var controllerData = new List<ControllerInfo>();
            foreach (var controller in controllers)
            {

                var methods = controller.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)
                    .Where(method => method.GetCustomAttribute<HttpMethodAttribute>() != null).ToList();

                if (methods.Any())
                {
                    var actions = methods.Select(method =>
                    {
                        var httpMethodAttribute = method.GetCustomAttribute<HttpMethodAttribute>();
                        return new ActionInfo
                        {
                            Name = method.Name,
                            HttpMethod = httpMethodAttribute?.HttpMethods?.FirstOrDefault().ToString(),
                            Path = GetPath(controller, method)
                        };
                    }).ToList();

                    controllerData.Add(new ControllerInfo
                    {
                        Name = controller.Name,
                        Actions = actions
                    });
                }

            }

            return Ok(controllerData);
        }
        private static string GetPath(Type controllerType, MethodInfo methodInfo)
        {

            var routeAttributeController = controllerType.GetCustomAttribute<RouteAttribute>();
            var routeAttributeMethod = methodInfo.GetCustomAttribute<RouteAttribute>();

            var controllerPath = routeAttributeController?.Template?.Replace("[controller]", controllerType.Name.Replace("Controller", ""));
            var methodPath = routeAttributeMethod?.Template;

            return $"{controllerPath}/{methodPath}".Replace("//", "/");
        }

        public class ControllerInfo
        {
            public required string Name { get; set; }
            public required List<ActionInfo> Actions { get; set; }
        }
        public class ActionInfo
        {
            public required string Name { get; set; }
            public string? HttpMethod { get; set; }
            public string? Path { get; set; }
        }
    }
}