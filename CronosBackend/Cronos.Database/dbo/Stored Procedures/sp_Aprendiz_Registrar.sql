

CREATE   PROCEDURE dbo.sp_Aprendiz_Registrar
    @Cedula NVARCHAR(20),
    @NombreCompleto NVARCHAR(150),
    @Telefono NVARCHAR(20),
    @Correo NVARCHAR(150),
    @Zona NVARCHAR(50),
    @Estado NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    /* -1 = cédula duplicada */
    IF EXISTS (
        SELECT 1
        FROM dbo.APRENDIZ
        WHERE cedula = @Cedula
    )
    BEGIN
        SELECT -1;
        RETURN;
    END

    /* -2 = correo ya utilizado */
    IF EXISTS (
        SELECT 1
        FROM dbo.USUARIO
        WHERE correo = @Correo
    )
    BEGIN
        SELECT -2;
        RETURN;
    END

    DECLARE @IdRol INT;
    DECLARE @IdUsuario INT;
    DECLARE @IdAprendiz INT;

    SELECT @IdRol = id_rol
    FROM dbo.ROL
    WHERE nombre = N'Aprendiz';

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO dbo.USUARIO
        (
            id_rol,
            nombre_completo,
            correo,
            contrasena_hash,
            estado
        )
        VALUES
        (
            @IdRol,
            @NombreCompleto,
            @Correo,
            CONVERT(
                NVARCHAR(255),
                HASHBYTES('SHA2_256', CONVERT(NVARCHAR(36), NEWID())),
                2
            ),
            @Estado
        );

        SET @IdUsuario = SCOPE_IDENTITY();

        INSERT INTO dbo.APRENDIZ
        (
            id_usuario,
            cedula,
            nombre_completo,
            telefono,
            correo,
            zona,
            estado
        )
        VALUES
        (
            @IdUsuario,
            @Cedula,
            @NombreCompleto,
            @Telefono,
            @Correo,
            @Zona,
            @Estado
        );

        SET @IdAprendiz = SCOPE_IDENTITY();

        COMMIT TRANSACTION;

        /* Devuelve el nuevo id_aprendiz */
        SELECT @IdAprendiz;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END