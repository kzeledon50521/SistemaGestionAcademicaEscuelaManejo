namespace Cronos.DTOs.Models
{
    public class HorarioDisponibleDTO
    {
        public int IdHorario { get; set; }
        public int IdInstructor { get; set; }
        public string NombreInstructor { get; set; } = string.Empty;
        public string Zona { get; set; } = string.Empty;
        public string Fecha { get; set; } = string.Empty;
        public string Hora { get; set; } = string.Empty;
    }
}
