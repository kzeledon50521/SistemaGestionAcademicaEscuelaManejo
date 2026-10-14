CREATE   PROCEDURE dbo.sp_Curso_Registrar
    @Nombre NVARCHAR(100),
    @Descripcion NVARCHAR(500),
    @TipoVehiculo NVARCHAR(30),
    @DuracionHoras INT,
    @Precio DECIMAL(10,2),
    @Estado NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.CURSO_PAQUETE(nombre, descripcion, tipo_vehiculo, duracion_horas, precio, estado)
    VALUES(@Nombre, @Descripcion, @TipoVehiculo, @DuracionHoras, @Precio, @Estado);

    SELECT CONVERT(INT, SCOPE_IDENTITY());
END