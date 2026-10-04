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

        [HttpPost]
        public async Task<IActionResult> Registrar(InstructorDTO instructor)
        {
            var resultado = await _service.RegistrarInstructor(instructor);
            if (resultado == -2) return BadRequest(new { mensaje = "Debe completar todos los campos obligatorios." });
            if (resultado == -1) return Conflict(new { mensaje = "Ya existe un instructor con esta cédula." });
            return Ok(new { mensaje = "Instructor registrado correctamente.", idInstructor = resultado });
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