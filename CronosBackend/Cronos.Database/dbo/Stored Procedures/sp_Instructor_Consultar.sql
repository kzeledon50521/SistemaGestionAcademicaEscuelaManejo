
CREATE   PROCEDURE dbo.sp_Instructor_Consultar
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id_instructor AS IdInstructor, cedula AS Cedula, nombre_completo AS NombreCompleto, telefono AS Telefono, zona_trabajo AS ZonaTrabajo, tipo_vehiculo AS TipoVehiculo, disponibilidad AS Disponibilidad, estado AS Estado
    FROM dbo.INSTRUCTOR
    ORDER BY nombre_completo;
END