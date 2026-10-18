using Cronos.DAL.Repositories;
using Cronos.DTOs.Models;

namespace Cronos.BLL.Services
{
    public class InscripcionService
    {
        private readonly InscripcionRepository _repository;

        public InscripcionService(InscripcionRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> RegistrarInscripcion(InscripcionDTO inscripcion)
        {
            if (inscripcion.IdAprendiz <= 0 || inscripcion.IdCursoPaquete <= 0)
                return -4;

            return await _repository.RegistrarInscripcion(inscripcion);
        }

        public async Task<IEnumerable<InscripcionDTO>> ObtenerInscripciones()
        {
            return await _repository.ObtenerInscripciones();
        }

        public async Task<int> ActualizarEstado(int idInscripcion, string estadoSolicitud)
        {
            return await _repository.ActualizarEstado(idInscripcion, estadoSolicitud);
        }
    }
}