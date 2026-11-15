using Cronos.DAL.Repositories;
using Cronos.DTOs.Models;

namespace Cronos.BLL.Services
{
    public class AgendaService
    {
        private readonly AgendaRepository _repository;

        private readonly int _horasMinimasCancelacion;

        public AgendaService(AgendaRepository repository, int horasMinimasCancelacion = 24)
        {
            _repository = repository;
            _horasMinimasCancelacion = horasMinimasCancelacion;
        }

        private static DateTime AhoraCostaRica() =>
            TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,
                TimeZoneInfo.FindSystemTimeZoneById("Central America Standard Time"));

        public async Task<IEnumerable<SesionDTO>> ObtenerSesionesAprendiz(int idAprendiz)
        {
            if (idAprendiz <= 0)
                throw new ArgumentException("Debe especificar un aprendiz válido.");

            return await _repository.ObtenerSesionesAprendiz(idAprendiz);
        }

        public async Task CancelarSesion(int idSesion, int idAprendiz)
        {
            if (idSesion <= 0)
                throw new ArgumentException("Debe seleccionar una sesión válida.");

            if (idAprendiz <= 0)
                throw new ArgumentException("Debe especificar un aprendiz válido.");

            var sesiones = await _repository.ObtenerSesionesAprendiz(idAprendiz);
            var sesion = sesiones.FirstOrDefault(s => s.IdSesion == idSesion)
                ?? throw new InvalidOperationException("La sesión no existe, no pertenece al aprendiz o ya fue cancelada.");

            var ahora = AhoraCostaRica();
            var inicio = DateTime.Parse(sesion.Fecha).Date + TimeSpan.Parse(sesion.Hora);

            if (inicio.Date <= ahora.Date || (inicio - ahora).TotalHours < _horasMinimasCancelacion)
                throw new InvalidOperationException(
                    $"No se puede cancelar la sesión: debe cancelarse con al menos {_horasMinimasCancelacion} horas de anticipación y no puede ser del mismo día.");

            await _repository.CancelarSesion(idSesion, idAprendiz);
        }

        public async Task<AgendaInstructorDTO> ObtenerAgendaInstructor(int idInstructor, string? vista, DateOnly? fecha)
        {
            if (idInstructor <= 0)
                throw new ArgumentException("Debe seleccionar un instructor válido.");

            var tipo = (vista ?? "semana").Trim().ToLowerInvariant();
            if (tipo != "semana" && tipo != "mes")
                throw new ArgumentException("La vista debe ser 'semana' o 'mes'.");

            var referencia = fecha ?? DateOnly.FromDateTime(AhoraCostaRica());
            DateOnly desde, hasta;
            if (tipo == "semana")
            {
                // Semana de lunes a domingo.
                var diasDesdeLunes = ((int)referencia.DayOfWeek + 6) % 7;
                desde = referencia.AddDays(-diasDesdeLunes);
                hasta = desde.AddDays(6);
            }
            else
            {
                desde = new DateOnly(referencia.Year, referencia.Month, 1);
                hasta = desde.AddMonths(1).AddDays(-1);
            }

            return new AgendaInstructorDTO
            {
                Vista = tipo,
                Desde = desde.ToString("yyyy-MM-dd"),
                Hasta = hasta.ToString("yyyy-MM-dd"),
                Sesiones = await _repository.ObtenerSesionesInstructor(idInstructor, desde, hasta)
            };
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

        public async Task<IEnumerable<AgendarDTO>> AgendarSesionCompleta(int id_horario, int id_aprendiz, string zona)
        {
            if (id_horario <= 0)
                throw new ArgumentException("Debe seleccionar un horario válido.");

            if (id_aprendiz <= 0)
                throw new ArgumentException("Debe especificar un aprendiz válido.");

            
            return await _repository.AgendarSesionCompleta(id_horario, id_aprendiz, zona);
        }
    }
}
