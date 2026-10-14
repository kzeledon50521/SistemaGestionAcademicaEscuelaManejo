namespace Cronos.DTOs.Models
{
    public class CursoDTO
    {
        public int IdCursoPaquete { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string TipoVehiculo { get; set; } = string.Empty;
        public int DuracionHoras { get; set; }
        public decimal Precio { get; set; }
        public string Estado { get; set; } = string.Empty;
    }
}