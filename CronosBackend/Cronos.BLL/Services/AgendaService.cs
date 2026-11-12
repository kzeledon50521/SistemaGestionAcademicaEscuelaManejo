using Cronos.DAL.Repositories;
using Cronos.DTOs.Models;

namespace Cronos.BLL.Services
{
    public class AgendaService
    {
        private readonly AgendaRepository _repository;

        public AgendaService(AgendaRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ZonaDTO>> ObtenerZonas()
        {
            return await _repository.ObtenerZonas();
        }

        public async Task<IEnumerable<InstructorAgendaDTO>> ObtenerInstructores(string? zona)
        {
            var nombreZona = await ValidarZona(zona);
            return await _repository.ObtenerInstructores(nombreZona);
        }

        public async Task<IEnumerable<HorarioDisponibleDTO>> ObtenerHorarios(string? zona, int idInstructor, DateOnly? fecha)
        {
            if (idInstructor <= 0)
                throw new ArgumentException("Debe seleccionar un instructor válido.");

            var ahora = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,
                TimeZoneInfo.FindSystemTimeZoneById("Central America Standard Time"));
            if (fecha.HasValue && fecha.Value < DateOnly.FromDateTime(ahora))
                throw new ArgumentException("No se pueden consultar fechas anteriores a hoy.");

            var nombreZona = await ValidarZona(zona);
            var instructores = await _repository.ObtenerInstructores(nombreZona);
            if (!instructores.Any(instructor => instructor.IdInstructor == idInstructor))
                throw new ArgumentException("El instructor no está activo o no pertenece a la zona seleccionada.");

            // SQL aplica días por zona, reloj de negocio y exclusión de sesiones ocupadas.
            return await _repository.ObtenerHorarios(nombreZona, idInstructor, fecha);
        }

        private async Task<string> ValidarZona(string? zona)
        {
            if (string.IsNullOrWhiteSpace(zona) || zona.Trim().Length > 50)
                throw new ArgumentException("Debe seleccionar una zona válida.");

            var zonas = await _repository.ObtenerZonas();
            var seleccionada = zonas.FirstOrDefault(item =>
                string.Equals(item.Nombre, zona.Trim(), StringComparison.OrdinalIgnoreCase));
            return seleccionada?.Nombre ?? throw new ArgumentException("La zona seleccionada no está disponible.");
        }
    }
}
