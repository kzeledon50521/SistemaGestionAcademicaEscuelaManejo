using Cronos.DTOs.Models;
using Dapper;
using Npgsql;

namespace Cronos.DAL.Repositories
{
    public class InstructorRepository
    {
        private readonly string _connectionString;

        public InstructorRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<int> RegistrarInstructor(InstructorDTO instructor)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            var parametros = new
            {
                instructor.Cedula,
                instructor.NombreCompleto,
                instructor.Telefono,
                instructor.ZonaTrabajo,
                instructor.TipoVehiculo,
                instructor.Disponibilidad,
                instructor.Estado
            };

            return await connection.ExecuteScalarAsync<int>(
                @"SELECT dbo.sp_instructor_registrar(
                    @Cedula,
                    @NombreCompleto,
                    @Telefono,
                    @ZonaTrabajo,
                    @TipoVehiculo,
                    @Disponibilidad,
                    @Estado
                );",
                parametros
            );
        }

        public async Task<IEnumerable<InstructorDTO>> ObtenerInstructores()
        {
            using var connection = new NpgsqlConnection(_connectionString);

            return await connection.QueryAsync<InstructorDTO>(
                "SELECT * FROM dbo.sp_instructor_consultar();"
            );
        }

        public async Task<int> ActualizarInstructor(InstructorDTO instructor)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            var parametros = new
            {
                instructor.IdInstructor,
                instructor.NombreCompleto,
                instructor.Telefono,
                instructor.ZonaTrabajo,
                instructor.TipoVehiculo,
                instructor.Disponibilidad,
                instructor.Estado
            };

            return await connection.ExecuteScalarAsync<int>(
                @"SELECT dbo.sp_instructor_actualizar(
                    @IdInstructor,
                    @NombreCompleto,
                    @Telefono,
                    @ZonaTrabajo,
                    @TipoVehiculo,
                    @Disponibilidad,
                    @Estado
                );",
                parametros
            );
        }
    }
}