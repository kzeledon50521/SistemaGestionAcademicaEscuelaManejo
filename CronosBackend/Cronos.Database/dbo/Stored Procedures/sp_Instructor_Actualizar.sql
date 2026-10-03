
CREATE   PROCEDURE dbo.sp_Instructor_Actualizar
    @IdInstructor INT,
    @NombreCompleto NVARCHAR(150),
    @Telefono NVARCHAR(20),
    @ZonaTrabajo NVARCHAR(50),
    @TipoVehiculo NVARCHAR(30),
    @Disponibilidad NVARCHAR(200),
    @Estado NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.INSTRUCTOR
    SET nombre_completo = @NombreCompleto, telefono = @Telefono, zona_trabajo = @ZonaTrabajo, tipo_vehiculo = @TipoVehiculo, disponibilidad = @Disponibilidad, estado = @Estado
    WHERE id_instructor = @IdInstructor;

    UPDATE U
    SET U.nombre_completo = @NombreCompleto, U.estado = @Estado
    FROM dbo.USUARIO U
    INNER JOIN dbo.INSTRUCTOR I ON I.id_usuario = U.id_usuario
    WHERE I.id_instructor = @IdInstructor;

    SELECT @@ROWCOUNT;
END