using Cronos.DAL.Repositories;
using Cronos.DTOs.Models;

namespace Cronos.BLL.Services
{
    public class CursoService
    {
        private readonly CursoRepository _repository;

        public CursoService(CursoRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> RegistrarCurso(CursoDTO curso)
        {
            if (string.IsNullOrWhiteSpace(curso.Nombre) || string.IsNullOrWhiteSpace(curso.TipoVehiculo) || curso.DuracionHoras <= 0 || curso.Precio <= 0 || string.IsNullOrWhiteSpace(curso.Estado)) return -1;
            return await _repository.RegistrarCurso(curso);
        }

        public async Task<IEnumerable<CursoDTO>> ObtenerCursos()
        {
            return await _repository.ObtenerCursos();
        }
    }
}