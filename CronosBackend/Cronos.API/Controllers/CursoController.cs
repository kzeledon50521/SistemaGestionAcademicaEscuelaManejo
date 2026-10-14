using Cronos.BLL.Services;
using Cronos.DTOs.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cronos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CursoController : ControllerBase
    {
        private readonly CursoService _service;

        public CursoController(CursoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Obtener()
        {
            return Ok(await _service.ObtenerCursos());
        }

        [HttpPost]
        public async Task<IActionResult> Registrar(CursoDTO curso)
        {
            var resultado = await _service.RegistrarCurso(curso);
            if (resultado == -1) return BadRequest(new { mensaje = "Debe completar todos los campos obligatorios correctamente." });
            return Ok(new { mensaje = "Curso registrado correctamente.", idCursoPaquete = resultado });
        }
    }
}