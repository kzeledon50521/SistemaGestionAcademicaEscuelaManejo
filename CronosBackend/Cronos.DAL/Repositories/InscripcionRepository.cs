using Cronos.DTOs.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Cronos.DAL.Repositories
{
    public class InscripcionRepository
    {
        private readonly string _connectionString;

        public InscripcionRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<int> RegistrarInscripcion(InscripcionDTO inscripcion)
        {
            using var connection = new SqlConnection(_connectionString);

            var parametros = new
            {
                inscripcion.IdAprendiz,
                inscripcion.IdCursoPaquete
            };

            return await connection.ExecuteScalarAsync<int>(
                "dbo.sp_Inscripcion_Registrar",
                parametros,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<InscripcionDTO>> ObtenerInscripciones()
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.QueryAsync<InscripcionDTO>(
                "dbo.sp_Inscripcion_Consultar",
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> ActualizarEstado(int idInscripcion, string estadoSolicitud)
        {
            using var connection = new SqlConnection(_connectionString);

            var parametros = new
            {
                IdInscripcion = idInscripcion,
                EstadoSolicitud = estadoSolicitud
            };

            return await connection.ExecuteScalarAsync<int>(
                "dbo.sp_Inscripcion_ActualizarEstado",
                parametros,
                commandType: CommandType.StoredProcedure
            );
        }
    }
}