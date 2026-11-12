CREATE PROCEDURE dbo.sp_Agenda_ConsultarInstructores
    @Zona NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT I.id_instructor AS IdInstructor, I.nombre_completo AS NombreCompleto
    FROM dbo.INSTRUCTOR I
    INNER JOIN dbo.ZONA Z ON Z.nombre = I.zona_trabajo
    WHERE Z.nombre = @Zona AND I.estado = N'Activo'
    ORDER BY I.nombre_completo, I.id_instructor;
END
