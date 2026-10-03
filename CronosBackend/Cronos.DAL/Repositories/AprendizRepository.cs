using Cronos.DTOs.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Cronos.DAL.Repositories
{
    public class AprendizRepository
    {
        private readonly string _connectionString;

        public AprendizRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<int> RegistrarAprendiz(AprendizDTO aprendiz)
        {
            using var connection = new SqlConnection(_connectionString);

            var parametros = new
            {
                aprendiz.Cedula,
                aprendiz.NombreCompleto,
                aprendiz.Telefono,
                aprendiz.Correo,
                aprendiz.Zona,
                aprendiz.Estado
            };

            return await connection.ExecuteScalarAsync<int>(
                "dbo.sp_Aprendiz_Registrar",
                parametros,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<AprendizDTO>> ObtenerAprendices()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<AprendizDTO>("dbo.sp_Aprendiz_Consultar", commandType: CommandType.StoredProcedure);
        }
    }
}