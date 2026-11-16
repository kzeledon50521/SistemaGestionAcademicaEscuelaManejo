
using Cronos.DTOs.Models;
using Dapper;
using Npgsql;

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
            using var connection = new NpgsqlConnection(_connectionString);

            return await connection.QueryAsync<ZonaDTO>(
                "SELECT * FROM dbo.sp_agenda_consultarzonas();");
        }

        public async Task<IEnumerable<InstructorAgendaDTO>> ObtenerInstructores(string zona)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            return await connection.QueryAsync<InstructorAgendaDTO>(
                "SELECT * FROM dbo.sp_agenda_consultarinstructores(CAST(@Zona AS varchar));",
                new { Zona = zona });
        }

        public async Task<IEnumerable<HorarioDisponibleDTO>> ObtenerHorarios(
            string zona, int idInstructor, DateOnly? fecha)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            var parametros = new
            {
                Zona = zona,
                IdInstructor = idInstructor,
                Fecha = fecha?.ToDateTime(TimeOnly.MinValue)
            };

            return await connection.QueryAsync<HorarioDisponibleDTO>(
                @"SELECT * FROM dbo.sp_agenda_consultarhorarios(
                    CAST(@Zona AS varchar),
                    @IdInstructor,
                    CAST(@Fecha AS date));",
                parametros);
        }

        public async Task<IEnumerable<SesionDTO>> ObtenerSesionesAprendiz(int idAprendiz)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            return await connection.QueryAsync<SesionDTO>(
                "SELECT * FROM dbo.sp_sesion_consultarporaprendiz(@IdAprendiz);",
                new { IdAprendiz = idAprendiz });
        }

        public async Task<IEnumerable<SesionDTO>> ObtenerSesionesInstructor(
            int idInstructor, DateOnly desde, DateOnly hasta)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            var parametros = new
            {
                IdInstructor = idInstructor,
                FechaInicio = desde.ToDateTime(TimeOnly.MinValue),
                FechaFin = hasta.ToDateTime(TimeOnly.MinValue)
            };

            return await connection.QueryAsync<SesionDTO>(
                @"SELECT * FROM dbo.sp_sesion_consultarporinstructor(
                    @IdInstructor,
                    CAST(@FechaInicio AS date),
                    CAST(@FechaFin AS date));",
                parametros);
        }

        public async Task CancelarSesion(int idSesion, int idAprendiz)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            try
            {
                var resultado = await connection.ExecuteScalarAsync<int>(
                    "SELECT dbo.sp_sesion_cancelar(@IdSesion, @IdAprendiz);",
                    new
                    {
                        IdSesion = idSesion,
                        IdAprendiz = idAprendiz
                    });

                if (resultado != 1)
                {
                    throw new InvalidOperationException(
                        "La sesión no existe, no pertenece al aprendiz o ya fue cancelada.");
                }
            }
            catch (PostgresException ex) when (ex.SqlState == "P0001")
            {
                throw new InvalidOperationException(
                    "La sesión no existe, no pertenece al aprendiz o ya fue cancelada.", ex);
            }
        }

        public async Task<IEnumerable<AgendarDTO>> AgendarSesionCompleta(
            int id_horario, int id_aprendiz, string zona)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                var respuestaHorario = await connection.ExecuteScalarAsync<int>(
                    "SELECT dbo.sp_agendarhorarioinstructor(@IdHorario);",
                    new { IdHorario = id_horario },
                    transaction: transaction);

                if (respuestaHorario != 1)
                {
                    throw new InvalidOperationException(
                        "No se pudo actualizar el estado del horario del instructor.");
                }

                var horarioInfo = await connection.QuerySingleOrDefaultAsync<HorarioInfo>(
                    @"SELECT
                        id_instructor AS IdInstructor,
                        fecha::text AS Fecha,
                        hora::text AS Hora
                      FROM dbo.horario_instructor
                      WHERE id_horario = @IdHorario;",
                    new { IdHorario = id_horario },
                    transaction: transaction);

                if (horarioInfo == null)
                {
                    throw new InvalidOperationException(
                        "No se encontró información para el horario especificado.");
                }

                var resultadoSesion = await connection.ExecuteScalarAsync<int>(
                    @"SELECT dbo.sp_agendarsesionpractica(
                        @IdAprendiz,
                        h.id_instructor,
                        h.fecha,
                        h.hora,
                        CAST(@Zona AS varchar),
                        CAST(@Estado AS varchar))
                      FROM dbo.horario_instructor h
                      WHERE h.id_horario = @IdHorario;",
                    new
                    {
                        IdHorario = id_horario,
                        IdAprendiz = id_aprendiz,
                        Zona = zona,
                        Estado = "Agendada"
                    },
                    transaction: transaction);

                if (resultadoSesion <= 0)
                {
                    throw new InvalidOperationException(
                        "No se pudo registrar la sesión práctica.");
                }

                await transaction.CommitAsync();

                return new List<AgendarDTO>
                {
                    new AgendarDTO
                    {
                        IdHorario = id_horario,
                        IdInstructor = horarioInfo.IdInstructor,
                        IdAprendiz = id_aprendiz,
                        Zona = zona,
                        Fecha = horarioInfo.Fecha,
                        Hora = horarioInfo.Hora
                    }
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private sealed class HorarioInfo
        {
            public int IdInstructor { get; set; }
            public string Fecha { get; set; } = string.Empty;
            public string Hora { get; set; } = string.Empty;
        }
    }
}
