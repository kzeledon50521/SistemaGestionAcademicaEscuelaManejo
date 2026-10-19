CREATE PROCEDURE [dbo].[sp_Inscripcion_ActualizarEstado]
    @IdInscripcion INT,
    @EstadoSolicitud NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- Solo se permiten estos estados
    IF @EstadoSolicitud NOT IN (N'Aprobada', N'Rechazada')
    BEGIN
        SELECT -1;
        RETURN;
    END

    -- Solo una solicitud pendiente puede aprobarse o rechazarse
    IF NOT EXISTS (
        SELECT 1
        FROM dbo.INSCRIPCION
        WHERE id_inscripcion = @IdInscripcion
          AND estado_solicitud = N'Pendiente'
    )
    BEGIN
        SELECT -2;
        RETURN;
    END

    UPDATE dbo.INSCRIPCION
    SET estado_solicitud = @EstadoSolicitud
    WHERE id_inscripcion = @IdInscripcion;

    SELECT 1;
END