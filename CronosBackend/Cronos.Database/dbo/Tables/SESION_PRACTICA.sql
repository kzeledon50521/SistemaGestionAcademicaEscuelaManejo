CREATE TABLE [dbo].[SESION_PRACTICA] (
    [id_sesion]     INT           IDENTITY (1, 1) NOT NULL,
    [id_aprendiz]   INT           NOT NULL,
    [id_instructor] INT           NOT NULL,
    [fecha]         DATE          NOT NULL,
    [hora]          TIME (7)      NOT NULL,
    [zona]          NVARCHAR (50) NOT NULL,
    [estado]        NVARCHAR (20) NOT NULL,
    PRIMARY KEY CLUSTERED ([id_sesion] ASC),
    CONSTRAINT [FK_SESION_APRENDIZ] FOREIGN KEY ([id_aprendiz]) REFERENCES [dbo].[APRENDIZ] ([id_aprendiz]),
    CONSTRAINT [FK_SESION_INSTRUCTOR] FOREIGN KEY ([id_instructor]) REFERENCES [dbo].[INSTRUCTOR] ([id_instructor])
);


GO
CREATE   TRIGGER dbo.TR_SESION_PRACTICA_ValidarInstructorActivo
ON dbo.SESION_PRACTICA
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted S
        INNER JOIN dbo.INSTRUCTOR I ON I.id_instructor = S.id_instructor
        WHERE I.estado <> N'Activo'
    )
    BEGIN
        RAISERROR(N'No se pueden asignar clases prácticas a un instructor inactivo.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END
GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Almacena las sesiones prácticas programadas entre aprendices e instructores.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'SESION_PRACTICA';

