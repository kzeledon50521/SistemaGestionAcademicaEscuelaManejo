using Cronos.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cronos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgendaController : ControllerBase
    {
        private readonly AgendaService _service;

        public AgendaController(AgendaService service)
        {
            _service = service;
        }

        [HttpGet("zonas")]
        public async Task<IActionResult> ObtenerZonas()
        {
            return Ok(await _service.ObtenerZonas());
        }

        [HttpGet("instructores")]
        public async Task<IActionResult> ObtenerInstructores([FromQuery] string? zona)
        {
            try
            {
                return Ok(await _service.ObtenerInstructores(zona));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpGet("horarios")]
        public async Task<IActionResult> ObtenerHorarios([FromQuery] string? zona, [FromQuery] int idInstructor, [FromQuery] DateOnly? fecha)
        {
            try
            {
                return Ok(await _service.ObtenerHorarios(zona, idInstructor, fecha));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost("agendar")]
        public async Task<IActionResult> AgendarSesion(
            [FromQuery] int idHorario,
            [FromQuery] int idAprendiz,
            [FromQuery] string zona)
        {
            try
            {
                var resultado = await _service.AgendarSesionCompleta(
                    idHorario,
                    idAprendiz,
                    zona
         
                );

                return Ok(new { mensaje = "Horario agendado correctamente" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error interno al procesar la agenda.", detalle = ex.Message });
            }
        }
    }
}
