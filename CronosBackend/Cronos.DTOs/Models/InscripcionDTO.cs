namespace Cronos.DTOs.Models
{
    public class InscripcionDTO
    {
        public int IdInscripcion { get; set; }
        public int IdAprendiz { get; set; }
        public int IdCursoPaquete { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public string EstadoSolicitud { get; set; } = string.Empty;

        public string NombreAprendiz { get; set; } = string.Empty;
        public string NombreCurso { get; set; } = string.Empty;
    }
}