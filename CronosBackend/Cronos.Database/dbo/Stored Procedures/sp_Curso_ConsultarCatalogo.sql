CREATE   PROCEDURE dbo.sp_Curso_ConsultarCatalogo
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id_curso_paquete AS IdCursoPaquete, nombre AS Nombre, descripcion AS Descripcion, tipo_vehiculo AS TipoVehiculo, duracion_horas AS DuracionHoras, precio AS Precio, estado AS Estado
    FROM dbo.CURSO_PAQUETE
    WHERE estado = 'Activo'
    ORDER BY nombre;
END
