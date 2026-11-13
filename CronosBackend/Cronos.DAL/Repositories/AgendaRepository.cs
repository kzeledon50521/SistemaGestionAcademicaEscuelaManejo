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

        

        public async Task<IEnumerable<AgendarDTO>> AgendarSesionCompleta(int id_horario, int id_aprendiz, string zona)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var transaction = connection.BeginTransaction();

            try
            {
             
                var resultadoHorario = await connection.QueryAsync<int>(
                    "dbo.sp_AgendarHorarioInstructor",
                    new { id_horario },
                    transaction: transaction,
                    commandType: CommandType.StoredProcedure);

                int respuestaHorario = resultadoHorario.FirstOrDefault();

                if (respuestaHorario != 1)
                {
                    throw new InvalidOperationException("No se pudo actualizar el estado del horario del instructor.");
                }

        
                var horarioInfo = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    @"SELECT id_instructor, fecha, hora
                      FROM dbo.HORARIO_INSTRUCTOR 
                      WHERE id_horario = @id_horario",
                    new { id_horario },
                    transaction: transaction);

                if (horarioInfo == null)
                {
                    throw new InvalidOperationException("No se encontró información para el horario especificado.");
                }

                
                await connection.ExecuteAsync(
                    "dbo.sp_AgendarSesionPráctica",
                    new
                    {
                        id_aprendiz = id_aprendiz,
                        id_instructor = (int)horarioInfo.id_instructor,
                        fecha = (DateTime)horarioInfo.fecha,
                        hora = (TimeSpan)horarioInfo.hora,
                        zona = zona,
                        estado = "Agendada"
                    },
                    transaction: transaction,
                    commandType: CommandType.StoredProcedure);

           
                await transaction.CommitAsync();

        
                var detalleAgendado = new List<AgendarDTO>
                {
                    new AgendarDTO
                    {
                        IdHorario = id_horario,
                        IdInstructor = (int)horarioInfo.id_instructor,
                        IdAprendiz = id_aprendiz,
                        Zona = horarioInfo.zona,
                        Fecha = ((DateTime)horarioInfo.fecha).ToString("yyyy-MM-dd"),
                        Hora = horarioInfo.hora.ToString()
                    }
                };

                return detalleAgendado;
            }
            catch (Exception)
            {
               
                await transaction.RollbackAsync();
                throw;
            }
        }


    }
}
