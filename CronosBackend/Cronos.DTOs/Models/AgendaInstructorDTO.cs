namespace Cronos.DTOs.Models
{
    public class AgendaInstructorDTO
    {
        public string Vista { get; set; } = string.Empty;
        public string Desde { get; set; } = string.Empty;
        public string Hasta { get; set; } = string.Empty;
        public IEnumerable<SesionDTO> Sesiones { get; set; } = Enumerable.Empty<SesionDTO>();
    }
}
