CREATE TABLE [dbo].[REPORTE] (
    [id_reporte]       INT           IDENTITY (1, 1) NOT NULL,
    [id_usuario]       INT           NOT NULL,
    [tipo]             NVARCHAR (50) NOT NULL,
    [fecha_generacion] DATE          NOT NULL,
    [formato]          NVARCHAR (10) NOT NULL,
    [estado]           NVARCHAR (20) NOT NULL,
    PRIMARY KEY CLUSTERED ([id_reporte] ASC),
    CONSTRAINT [FK_REPORTE_USUARIO] FOREIGN KEY ([id_usuario]) REFERENCES [dbo].[USUARIO] ([id_usuario])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Registra los reportes generados por los usuarios del sistema.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'REPORTE';

