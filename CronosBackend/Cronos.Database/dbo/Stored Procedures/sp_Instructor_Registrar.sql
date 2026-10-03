CREATE   PROCEDURE dbo.sp_Instructor_Registrar
    @Cedula NVARCHAR(20),
    @NombreCompleto NVARCHAR(150),
    @Telefono NVARCHAR(20),
    @ZonaTrabajo NVARCHAR(50),
    @TipoVehiculo NVARCHAR(30),
    @Disponibilidad NVARCHAR(200),
    @Estado NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF EXISTS (SELECT 1 FROM dbo.INSTRUCTOR WHERE cedula = @Cedula)
    BEGIN
        SELECT -1;
        RETURN;
    END

    DECLARE @IdRol INT;
    DECLARE @IdUsuario INT;
    DECLARE @IdInstructor INT;

    SELECT @IdRol = id_rol FROM dbo.ROL WHERE nombre = N'Instructor';

    IF @IdRol IS NULL
    BEGIN
        INSERT INTO dbo.ROL(nombre, descripcion) VALUES(N'Instructor', N'Usuario instructor de la autoescuela');
        SET @IdRol = SCOPE_IDENTITY();
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO dbo.USUARIO(id_rol, nombre_completo, correo, contrasena_hash, estado)
        VALUES(@IdRol, @NombreCompleto, CONCAT(N'instructor.', @Cedula, N'@cronos.local'), CONVERT(NVARCHAR(255), HASHBYTES('SHA2_256', CONVERT(NVARCHAR(36), NEWID())), 2), @Estado);

        SET @IdUsuario = SCOPE_IDENTITY();

        INSERT INTO dbo.INSTRUCTOR(id_usuario, cedula, nombre_completo, telefono, zona_trabajo, tipo_vehiculo, disponibilidad, estado)
        VALUES(@IdUsuario, @Cedula, @NombreCompleto, @Telefono, @ZonaTrabajo, @TipoVehiculo, @Disponibilidad, @Estado);

        SET @IdInstructor = SCOPE_IDENTITY();

        COMMIT TRANSACTION;

        SELECT @IdInstructor;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END