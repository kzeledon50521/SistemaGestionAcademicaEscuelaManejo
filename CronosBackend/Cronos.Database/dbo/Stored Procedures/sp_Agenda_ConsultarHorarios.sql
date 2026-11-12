CREATE PROCEDURE dbo.sp_Agenda_ConsultarHorarios
    @Zona NVARCHAR(50),
    @IdInstructor INT,
    @Fecha DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Reloj de negocio de Costa Rica, independiente de la zona del servidor.
    DECLARE @Ahora DATETIME2(7) = CONVERT(DATETIME2(7),
        SYSUTCDATETIME() AT TIME ZONE 'UTC' AT TIME ZONE 'Central America Standard Time');

    SELECT H.id_horario AS IdHorario,
           I.id_instructor AS IdInstructor,
           I.nombre_completo AS NombreInstructor,
           Z.nombre AS Zona,
           CONVERT(CHAR(10), H.fecha, 23) AS Fecha,
           CONVERT(VARCHAR(16), H.hora) AS Hora
    FROM dbo.HORARIO_INSTRUCTOR H
    INNER JOIN dbo.INSTRUCTOR I ON I.id_instructor = H.id_instructor
    INNER JOIN dbo.ZONA Z ON Z.nombre = I.zona_trabajo
    INNER JOIN dbo.ZONA_DIA_DISPONIBLE D ON D.id_zona = Z.id_zona
        -- 1900-01-01 fue lunes; no depende de SET DATEFIRST ni del idioma.
        AND D.dia_semana = ((DATEDIFF(DAY, CONVERT(DATE, '19000101', 112), H.fecha) % 7 + 7) % 7) + 1
    WHERE I.id_instructor = @IdInstructor
      AND Z.nombre = @Zona
      AND I.estado = N'Activo'
      AND H.estado = N'Activo'
      AND (@Fecha IS NULL OR H.fecha = @Fecha)
      AND (H.fecha > CONVERT(DATE, @Ahora)
           OR H.fecha = CONVERT(DATE, @Ahora) AND H.hora > CONVERT(TIME(7), @Ahora))
      -- No hay regla aprobada para liberar cancelaciones: toda coincidencia bloquea.
      AND NOT EXISTS (
          SELECT 1 FROM dbo.SESION_PRACTICA S
          WHERE S.id_instructor = H.id_instructor
            AND S.fecha = H.fecha AND S.hora = H.hora
      )
    ORDER BY H.fecha, H.hora;
END
