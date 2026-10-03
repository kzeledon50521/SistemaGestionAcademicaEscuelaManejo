using Cronos.BLL.Services;
using Cronos.DTOs.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cronos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AprendizController : ControllerBase
    {
        private readonly AprendizService _service;

        public AprendizController(AprendizService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            var aprendices = await _service.ObtenerAprendices();
            return Ok(aprendices);
        }

        [HttpPost]
        public async Task<IActionResult> Registrar(AprendizDTO aprendiz)
        {
            var resultado = await _service.RegistrarAprendiz(aprendiz);

            return resultado switch
            {
                -3 => BadRequest(new
                {
                    mensaje = "Debe completar todos los campos obligatorios."
                }),

                -1 => Conflict(new
                {
                    mensaje = "Ya existe un aprendiz registrado con esta cédula."
                }),

                -2 => Conflict(new
                {
                    mensaje = "El correo electrónico ya se encuentra registrado."
                }),

                > 0 => Ok(new
                {
                    mensaje = "Aprendiz registrado correctamente.",
                    idAprendiz = resultado
                }),

                _ => StatusCode(500, new
                {
                    mensaje = "No fue posible registrar el aprendiz."
                })
            };
        }
    }
}