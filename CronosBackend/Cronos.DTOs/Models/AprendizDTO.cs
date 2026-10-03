namespace Cronos.DTOs.Models
{
	public class AprendizDTO
	{
		public int IdAprendiz { get; set; }

		public string Cedula { get; set; } = string.Empty;

		public string NombreCompleto { get; set; } = string.Empty;

		public string Telefono { get; set; } = string.Empty;

		public string Correo { get; set; } = string.Empty;

		public string Zona { get; set; } = string.Empty;

		public string Estado { get; set; } = string.Empty;

        public decimal Progreso { get; set; }
    }
}