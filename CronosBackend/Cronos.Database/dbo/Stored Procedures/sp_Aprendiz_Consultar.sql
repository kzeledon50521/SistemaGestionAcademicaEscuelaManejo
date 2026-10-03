CREATE   PROCEDURE dbo.sp_Aprendiz_Consultar
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        A.id_aprendiz AS IdAprendiz,
        A.cedula AS Cedula,
        A.nombre_completo AS NombreCompleto,
        A.telefono AS Telefono,
        A.correo AS Correo,
        A.zona AS Zona,
        A.estado AS Estado,
        ISNULL(S.indice_preparacion, 0) AS Progreso
    FROM dbo.APRENDIZ A
    LEFT JOIN dbo.SEGUIMIENTO_PROGRESO S ON S.id_aprendiz = A.id_aprendiz
    ORDER BY A.nombre_completo;
END