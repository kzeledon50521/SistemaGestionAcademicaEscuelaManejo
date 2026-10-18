CREATE PROCEDURE [dbo].[sp_Inscripcion_Consultar]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        I.id_inscripcion AS IdInscripcion,
        I.id_aprendiz AS IdAprendiz,
        I.id_curso_paquete AS IdCursoPaquete,
        A.nombre_completo AS NombreAprendiz,
        C.nombre AS NombreCurso,
        I.fecha_solicitud AS FechaSolicitud,
        I.estado_solicitud AS EstadoSolicitud
    FROM dbo.INSCRIPCION I
    INNER JOIN dbo.APRENDIZ A
        ON A.id_aprendiz = I.id_aprendiz
    INNER JOIN dbo.CURSO_PAQUETE C
        ON C.id_curso_paquete = I.id_curso_paquete
    ORDER BY I.fecha_solicitud DESC, I.id_inscripcion DESC;
END