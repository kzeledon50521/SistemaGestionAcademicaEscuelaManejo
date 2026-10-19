using Cronos.BLL.Services;
using Cronos.DTOs.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cronos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InscripcionController : ControllerBase
    {
        private readonly InscripcionService _service;

        public InscripcionController(InscripcionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            return Ok(await _service.ObtenerInscripciones());
        }

        [HttpPost]
        public async Task<IActionResult> Registrar(InscripcionDTO inscripcion)
        {
            var resultado = await _service.RegistrarInscripcion(inscripcion);

            return resultado switch
            {
                -4 => BadRequest(new { mensaje = "Debe seleccionar un aprendiz y un curso." }),
                -1 => NotFound(new { mensaje = "El aprendiz seleccionado no existe." }),
                -2 => BadRequest(new { mensaje = "El curso seleccionado no está disponible." }),
                -3 => Conflict(new { mensaje = "El aprendiz ya tiene una solicitud pendiente." }),

                > 0 => Ok(new
                {
                    mensaje = "Solicitud registrada correctamente.",
                    idInscripcion = resultado
                }),

                _ => StatusCode(500, new { mensaje = "No fue posible registrar la solicitud." })
            };
        }

        [HttpPut("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, ActualizarEstadoInscripcionDTO datos)
        {
            var resultado = await _service.ActualizarEstado(
                id,
                datos.EstadoSolicitud
            );

            return resultado switch
            {
                -1 => BadRequest(new { mensaje = "Estado de solicitud no válido." }),
                -2 => BadRequest(new { mensaje = "La solicitud no existe o ya fue procesada." }),

                1 => Ok(new
                {
                    mensaje = $"Solicitud {datos.EstadoSolicitud.ToLower()} correctamente."
                }),

                _ => StatusCode(500, new { mensaje = "No fue posible actualizar la solicitud." })
            };
        }
    }
}