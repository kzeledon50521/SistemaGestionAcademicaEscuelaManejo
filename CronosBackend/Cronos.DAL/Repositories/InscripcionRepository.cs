using Cronos.DTOs.Models;
using Dapper;
using Npgsql;

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
            using var connection = new NpgsqlConnection(_connectionString);

            var parametros = new
            {
                inscripcion.IdAprendiz,
                inscripcion.IdCursoPaquete
            };

            return await connection.ExecuteScalarAsync<int>(
    @"SELECT dbo.sp_inscripcion_registrar(
        @IdAprendiz,
        @IdCursoPaquete
    );",
    parametros
);
        }

        public async Task<IEnumerable<InscripcionDTO>> ObtenerInscripciones()
        {
            using var connection = new NpgsqlConnection(_connectionString);

            return await connection.QueryAsync<InscripcionDTO>(
     "SELECT * FROM dbo.sp_inscripcion_consultar();"
 );
        }

        public async Task<int> ActualizarEstado(int idInscripcion, string estadoSolicitud)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            var parametros = new
            {
                IdInscripcion = idInscripcion,
                EstadoSolicitud = estadoSolicitud
            };

            return await connection.ExecuteScalarAsync<int>(
    @"SELECT dbo.sp_inscripcion_actualizarestado(
        @IdInscripcion,
        @EstadoSolicitud
    );",
    parametros
);
        }
    }
}