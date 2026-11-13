CREATE PROCEDURE [dbo].[sp_AgendarSesionPráctica]
    @id_aprendiz INT,
    @id_instructor INT,
    @fecha DATE,
    @hora TIME(7),
    @zona NVARCHAR(50),
    @estado NVARCHAR(20) = N'Agendada' -- Valor por defecto según lo que platicamos antes
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Validar si el instructor ya tiene una sesión ocupada en la misma fecha y hora
    IF EXISTS (
        SELECT 1 
        FROM [dbo].[SESION_PRACTICA] 
        WHERE [id_instructor] = @id_instructor 
          AND [fecha] = @fecha 
          AND [hora] = @hora
          -- Opcional: si quieres ignorar las canceladas, podrías agregar una condición de estado
    )
    BEGIN
        RAISERROR('El instructor ya cuenta con una sesión agendada en esta fecha y hora.', 16, 1);
        RETURN;
    END

    -- 2. Insertar la nueva sesión práctica
    INSERT INTO [dbo].[SESION_PRACTICA] (
        [id_aprendiz], 
        [id_instructor], 
        [fecha], 
        [hora], 
        [zona], 
        [estado]
    )
    VALUES (
        @id_aprendiz, 
        @id_instructor, 
        @fecha, 
        @hora, 
        @zona, 
        @estado
    );

END;
GO