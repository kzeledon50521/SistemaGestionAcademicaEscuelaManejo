namespace Cronos.DTOs.Models
{
    public class InstructorDTO
    {
        public int IdInstructor { get; set; }
        public string Cedula { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string ZonaTrabajo { get; set; } = string.Empty;
        public string TipoVehiculo { get; set; } = string.Empty;
        public string Disponibilidad { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
    }
}