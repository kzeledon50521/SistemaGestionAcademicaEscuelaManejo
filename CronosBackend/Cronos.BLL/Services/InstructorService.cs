using Cronos.DAL.Repositories;
using Cronos.DTOs.Models;

namespace Cronos.BLL.Services
{
    public class InstructorService
    {
        private readonly InstructorRepository _repository;

        public InstructorService(InstructorRepository repository)
        {
            _repository = repository;
        }

       

        public async Task<IEnumerable<InstructorDTO>> ObtenerInstructores()
        {
            return await _repository.ObtenerInstructores();
        }

        public async Task<int> ActualizarInstructor(InstructorDTO instructor)
        {
            if (instructor.IdInstructor <= 0 || string.IsNullOrWhiteSpace(instructor.NombreCompleto) || string.IsNullOrWhiteSpace(instructor.Telefono) || string.IsNullOrWhiteSpace(instructor.ZonaTrabajo) || string.IsNullOrWhiteSpace(instructor.TipoVehiculo) || string.IsNullOrWhiteSpace(instructor.Disponibilidad) || string.IsNullOrWhiteSpace(instructor.Estado)) return -2;
            return await _repository.ActualizarInstructor(instructor);
        }
    }
}