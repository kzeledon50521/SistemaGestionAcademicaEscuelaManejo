CREATE PROCEDURE [dbo].[sp_Inscripcion_Registrar]
    @IdAprendiz INT,
    @IdCursoPaquete INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar aprendiz
    IF NOT EXISTS (
        SELECT 1
        FROM dbo.APRENDIZ
        WHERE id_aprendiz = @IdAprendiz
    )
    BEGIN
        SELECT -1;
        RETURN;
    END

    -- El curso debe estar disponible
    IF NOT EXISTS (
        SELECT 1
        FROM dbo.CURSO_PAQUETE
        WHERE id_curso_paquete = @IdCursoPaquete
          AND estado = N'Activo'
    )
    BEGIN
        SELECT -2;
        RETURN;
    END

    -- El aprendiz no puede tener otra solicitud pendiente
    IF EXISTS (
        SELECT 1
        FROM dbo.INSCRIPCION
        WHERE id_aprendiz = @IdAprendiz
          AND estado_solicitud = N'Pendiente'
    )
    BEGIN
        SELECT -3;
        RETURN;
    END

    INSERT INTO dbo.INSCRIPCION
    (
        id_aprendiz,
        id_curso_paquete,
        fecha_solicitud,
        estado_solicitud
    )
    VALUES
    (
        @IdAprendiz,
        @IdCursoPaquete,
        CAST(GETDATE() AS DATE),
        N'Pendiente'
    );

    SELECT CONVERT(INT, SCOPE_IDENTITY());
END