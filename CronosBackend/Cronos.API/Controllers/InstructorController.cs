using Cronos.BLL.Services;
using Cronos.DTOs.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cronos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorController : ControllerBase
    {
        private readonly InstructorService _service;

        public InstructorController(InstructorService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            return Ok(await _service.ObtenerInstructores());
        }

      
        [HttpPut]
        public async Task<IActionResult> Actualizar(InstructorDTO instructor)
        {
            var resultado = await _service.ActualizarInstructor(instructor);
            if (resultado == -2) return BadRequest(new { mensaje = "Debe completar todos los campos obligatorios." });
            if (resultado <= 0) return NotFound(new { mensaje = "Instructor no encontrado." });
            return Ok(new { mensaje = "Instructor actualizado correctamente." });
        }
    }
}