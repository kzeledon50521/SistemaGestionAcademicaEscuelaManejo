namespace Cronos.DTOs.Models
{
    public class SesionDTO
    {
        public int IdSesion { get; set; }
        public int IdAprendiz { get; set; }
        public string NombreAprendiz { get; set; } = string.Empty;
        public int IdInstructor { get; set; }
        public string NombreInstructor { get; set; } = string.Empty;
        public string Zona { get; set; } = string.Empty;
        public string Fecha { get; set; } = string.Empty;
        public string Hora { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
    }
}
