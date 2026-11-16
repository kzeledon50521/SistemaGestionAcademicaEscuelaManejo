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

        [HttpGet("sesiones")]
        public async Task<IActionResult> ObtenerSesionesAprendiz([FromQuery] int idAprendiz)
        {
            try
            {
                return Ok(await _service.ObtenerSesionesAprendiz(idAprendiz));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        [HttpPost("cancelar")]
        public async Task<IActionResult> CancelarSesion([FromQuery] int idSesion, [FromQuery] int idAprendiz)
        {
            try
            {
                await _service.CancelarSesion(idSesion, idAprendiz);
                return Ok(new { mensaje = "Sesión cancelada correctamente." });
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
                return StatusCode(500, new { mensaje = "Ocurrió un error interno al cancelar la sesión.", detalle = ex.Message });
            }
        }

        [HttpGet("agenda-instructor")]
        public async Task<IActionResult> ObtenerAgendaInstructor(
            [FromQuery] int idInstructor,
            [FromQuery] string? vista,
            [FromQuery] DateOnly? fecha)
        {
            try
            {
                return Ok(await _service.ObtenerAgendaInstructor(idInstructor, vista, fecha));
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
