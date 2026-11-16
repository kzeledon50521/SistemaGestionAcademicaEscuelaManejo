CREATE PROCEDURE dbo.sp_Sesion_ConsultarPorInstructor
    @IdInstructor INT,
    @FechaInicio DATE,
    @FechaFin DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT S.id_sesion AS IdSesion,
           S.id_aprendiz AS IdAprendiz,
           A.nombre_completo AS NombreAprendiz,
           S.id_instructor AS IdInstructor,
           I.nombre_completo AS NombreInstructor,
           S.zona AS Zona,
           CONVERT(CHAR(10), S.fecha, 23) AS Fecha,
           CONVERT(VARCHAR(8), S.hora) AS Hora,
           S.estado AS Estado
    FROM dbo.SESION_PRACTICA S
    INNER JOIN dbo.APRENDIZ A ON A.id_aprendiz = S.id_aprendiz
    INNER JOIN dbo.INSTRUCTOR I ON I.id_instructor = S.id_instructor
    WHERE S.id_instructor = @IdInstructor
      AND S.estado = N'Agendada'
      AND S.fecha BETWEEN @FechaInicio AND @FechaFin
    ORDER BY S.fecha, S.hora;
END
GO
