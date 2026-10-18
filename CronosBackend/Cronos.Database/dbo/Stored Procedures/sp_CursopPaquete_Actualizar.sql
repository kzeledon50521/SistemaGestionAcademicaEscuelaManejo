CREATE PROCEDURE dbo.sp_CursoPaquete_Actualizar
    @IdCursoPaquete INT,
    @Nombre NVARCHAR(100),
    @Descripcion NVARCHAR(500),
    @TipoVehiculo NVARCHAR(30),
    @DuracionHoras INT,
    @Precio DECIMAL(10, 2),
    @Estado NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.CURSO_PAQUETE
    SET nombre = @Nombre,
        descripcion = @Descripcion,
        tipo_vehiculo = @TipoVehiculo,
        duracion_horas = @DuracionHoras,
        precio = @Precio,
        estado = @Estado
    WHERE id_curso_paquete = @IdCursoPaquete;

    SELECT @@ROWCOUNT AS FilasAfectadas;
END
GO