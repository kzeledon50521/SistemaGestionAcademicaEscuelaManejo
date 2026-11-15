CREATE PROCEDURE dbo.sp_Sesion_Cancelar
    @IdSesion INT,
    @IdAprendiz INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @id_instructor INT, @fecha DATE, @hora TIME(7);

    BEGIN TRANSACTION;

    SELECT @id_instructor = id_instructor, @fecha = fecha, @hora = hora
    FROM dbo.SESION_PRACTICA WITH (UPDLOCK, HOLDLOCK)
    WHERE id_sesion = @IdSesion
      AND id_aprendiz = @IdAprendiz
      AND estado = N'Agendada';

    IF @id_instructor IS NULL
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 51001, N'La sesion no existe, no pertenece al aprendiz o ya fue cancelada.', 1;
    END

    UPDATE dbo.SESION_PRACTICA
    SET estado = N'Cancelada'
    WHERE id_sesion = @IdSesion;

    -- Libera el horario del instructor.
    UPDATE dbo.HORARIO_INSTRUCTOR
    SET estado = N'Activo'
    WHERE id_instructor = @id_instructor
      AND fecha = @fecha
      AND hora = @hora
      AND estado = N'Agendado';

    -- Libera la hora de traslado previa, que solo dependia de esta sesion.
    UPDATE dbo.HORARIO_INSTRUCTOR
    SET estado = N'Activo'
    WHERE id_instructor = @id_instructor
      AND fecha = @fecha
      AND hora = DATEADD(HOUR, -1, @hora)
      AND estado = N'Traslado';

    COMMIT TRANSACTION;

    SELECT 1 AS Resultado;
END
GO
