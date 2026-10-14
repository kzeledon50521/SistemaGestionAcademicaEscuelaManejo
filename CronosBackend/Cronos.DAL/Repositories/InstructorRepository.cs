using Cronos.DTOs.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

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
            using var connection = new SqlConnection(_connectionString);
            var parametros = new { instructor.Cedula, instructor.NombreCompleto, instructor.Telefono, instructor.ZonaTrabajo, instructor.TipoVehiculo, instructor.Disponibilidad, instructor.Estado };
            return await connection.ExecuteScalarAsync<int>("dbo.sp_Instructor_Registrar", parametros, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<InstructorDTO>> ObtenerInstructores()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<InstructorDTO>("dbo.sp_Instructor_Consultar", commandType: CommandType.StoredProcedure);
        }

        public async Task<int> ActualizarInstructor(InstructorDTO instructor)
        {
            using var connection = new SqlConnection(_connectionString);
            var parametros = new { instructor.IdInstructor, instructor.NombreCompleto, instructor.Telefono, instructor.ZonaTrabajo, instructor.TipoVehiculo, instructor.Disponibilidad, instructor.Estado };
            return await connection.ExecuteScalarAsync<int>("dbo.sp_Instructor_Actualizar", parametros, commandType: CommandType.StoredProcedure);
        }
    }
}