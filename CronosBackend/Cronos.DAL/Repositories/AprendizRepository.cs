using Cronos.DTOs.Models;
using Dapper;
using Npgsql;

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
            using var connection = new NpgsqlConnection(_connectionString);

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
                @"SELECT dbo.sp_aprendiz_registrar(
                    @Cedula,
                    @NombreCompleto,
                    @Telefono,
                    @Correo,
                    @Zona,
                    @Estado
                );",
                parametros
            );
        }

        public async Task<IEnumerable<AprendizDTO>> ObtenerAprendices()
        {
            using var connection = new NpgsqlConnection(_connectionString);

            return await connection.QueryAsync<AprendizDTO>(
                "SELECT * FROM dbo.sp_aprendiz_consultar();"
            );
        }
    }
}