using Cronos.DTOs.Models;
using Dapper;
using Npgsql;

namespace Cronos.DAL.Repositories
{
    public class CursoRepository
    {
        private readonly string _connectionString;

        public CursoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<int> RegistrarCurso(CursoDTO curso)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            var parametros = new
            {
                curso.Nombre,
                curso.Descripcion,
                curso.TipoVehiculo,
                curso.DuracionHoras,
                curso.Precio,
                curso.Estado
            };

            return await connection.ExecuteScalarAsync<int>(
                @"SELECT dbo.sp_curso_registrar(
                    @Nombre,
                    @Descripcion,
                    @TipoVehiculo,
                    @DuracionHoras,
                    @Precio,
                    @Estado
                );",
                parametros
            );
        }

        public async Task<IEnumerable<CursoDTO>> ObtenerCursos()
        {
            using var connection = new NpgsqlConnection(_connectionString);

            return await connection.QueryAsync<CursoDTO>(
                "SELECT * FROM dbo.sp_curso_consultar();"
            );
        }
    }
}