using Cronos.DTOs.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Cronos.DAL.Repositories
{
    public class AgendaRepository
    {
        private readonly string _connectionString;

        public AgendaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ZonaDTO>> ObtenerZonas()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<ZonaDTO>("dbo.sp_Agenda_ConsultarZonas", commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<InstructorAgendaDTO>> ObtenerInstructores(string zona)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<InstructorAgendaDTO>("dbo.sp_Agenda_ConsultarInstructores",
                new { Zona = zona }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<HorarioDisponibleDTO>> ObtenerHorarios(string zona, int idInstructor, DateOnly? fecha)
        {
            using var connection = new SqlConnection(_connectionString);
            var parametros = new { Zona = zona, IdInstructor = idInstructor, Fecha = fecha?.ToDateTime(TimeOnly.MinValue) };
            return await connection.QueryAsync<HorarioDisponibleDTO>("dbo.sp_Agenda_ConsultarHorarios",
                parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
