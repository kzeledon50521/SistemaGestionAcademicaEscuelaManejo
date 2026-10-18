CREATE   PROCEDURE dbo.sp_Curso_Deshabilitar
    @IdCursoPaquete INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.CURSO_PAQUETE
    SET estado = 'Inactivo'
    WHERE id_curso_paquete = @IdCursoPaquete AND estado = 'Activo';

    SELECT @@ROWCOUNT;
END
