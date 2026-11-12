CREATE PROCEDURE dbo.sp_Agenda_ConsultarZonas
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id_zona AS IdZona, nombre AS Nombre
    FROM dbo.ZONA
    ORDER BY nombre;
END
