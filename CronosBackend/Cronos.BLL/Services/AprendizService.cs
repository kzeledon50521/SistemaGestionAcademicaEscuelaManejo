using Cronos.DAL.Repositories;
using Cronos.DTOs.Models;

namespace Cronos.BLL.Services
{
    public class AprendizService
    {
        private readonly AprendizRepository _repository;

        public AprendizService(AprendizRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> RegistrarAprendiz(AprendizDTO aprendiz)
        {
            if (string.IsNullOrWhiteSpace(aprendiz.Cedula) || string.IsNullOrWhiteSpace(aprendiz.NombreCompleto) || string.IsNullOrWhiteSpace(aprendiz.Telefono) || string.IsNullOrWhiteSpace(aprendiz.Correo) || string.IsNullOrWhiteSpace(aprendiz.Zona) || string.IsNullOrWhiteSpace(aprendiz.Estado))
            {
                return -3;
            }

            return await _repository.RegistrarAprendiz(aprendiz);
        }

        public async Task<IEnumerable<AprendizDTO>> ObtenerAprendices()
        {
            return await _repository.ObtenerAprendices();
        }
    }
}