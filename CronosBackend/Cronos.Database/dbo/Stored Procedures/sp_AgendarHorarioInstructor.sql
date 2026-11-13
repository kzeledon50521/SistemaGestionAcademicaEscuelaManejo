
CREATE PROCEDURE [dbo].[sp_AgendarHorarioInstructor]
    @id_horario INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Variables para almacenar los datos del horario a agendar
    DECLARE @id_instructor INT;
    DECLARE @fecha DATE;
    DECLARE @hora TIME(7);
    DECLARE @estado_actual NVARCHAR(20);
    DECLARE @hora_anterior TIME(7);

    -- 1. Obtener la información del horario seleccionado
    SELECT 
        @id_instructor = [id_instructor],
        @fecha = [fecha],
        @hora = [hora],
        @estado_actual = [estado]
    FROM [dbo].[HORARIO_INSTRUCTOR]
    WHERE [id_horario] = @id_horario;

    -- Validar que el horario exista
    IF @id_instructor IS NULL
    BEGIN
        RAISERROR('El horario especificado no existe.', 16, 1);
        RETURN;
    END

    -- 2. Calcular la hora anterior (restando 1 hora)
    SET @hora_anterior = DATEADD(HOUR, -1, @hora);

    -- 3. Validar si ya existe una fila registrada exactamente una hora antes para el mismo instructor y fecha
    IF EXISTS (
        SELECT 1 
        FROM [dbo].[HORARIO_INSTRUCTOR]
        WHERE [id_instructor] = @id_instructor
          AND [fecha] = @fecha
          AND [hora] = @hora_anterior
    )
    BEGIN
        -- Caso A: La hora anterior existe. Verificamos su estado.
        DECLARE @id_horario_anterior INT;
        DECLARE @estado_anterior NVARCHAR(20);

        SELECT 
            @id_horario_anterior = [id_horario],
            @estado_anterior = [estado]
        FROM [dbo].[HORARIO_INSTRUCTOR]
        WHERE [id_instructor] = @id_instructor
          AND [fecha] = @fecha
          AND [hora] = @hora_anterior;

        -- Si la hora anterior está Activa (disponible), la pasamos a Traslado
        IF @estado_anterior = N'Activo'
        BEGIN
            UPDATE [dbo].[HORARIO_INSTRUCTOR]
            SET [estado] = N'Traslado'
            WHERE [id_horario] = @id_horario_anterior;
        END
        ELSE
        BEGIN
            IF @estado_anterior <> N'Traslado'
            BEGIN
                RAISERROR('No se puede agendar porque la hora previa de traslado ya se encuentra ocupada.', 16, 1);
                RETURN;
            END
        END
    END
    ELSE
    BEGIN
        -- Caso B: No existe una fila una hora antes. Insertarla con estado 'Traslado'
        INSERT INTO [dbo].[HORARIO_INSTRUCTOR] ([id_instructor], [fecha], [hora], [estado])
        VALUES (@id_instructor, @fecha, @hora_anterior, N'Traslado');
    END

    -- 4. Finalmente, actualizar el horario seleccionado al estado 'Agendada'
    UPDATE [dbo].[HORARIO_INSTRUCTOR]
    SET [estado] = N'Agendado'
    WHERE [id_horario] = @id_horario;

    -- Devolver un 1 indicando éxito
    SELECT 1 AS [Resultado];
END;
GO