using Cronos.DTOs.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

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
            using var connection = new SqlConnection(_connectionString);
            var parametros = new { curso.Nombre, curso.Descripcion, curso.TipoVehiculo, curso.DuracionHoras, curso.Precio, curso.Estado };
            return await connection.ExecuteScalarAsync<int>("dbo.sp_Curso_Registrar", parametros, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<CursoDTO>> ObtenerCursos()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<CursoDTO>("dbo.sp_Curso_Consultar", commandType: CommandType.StoredProcedure);
        }
    }
}