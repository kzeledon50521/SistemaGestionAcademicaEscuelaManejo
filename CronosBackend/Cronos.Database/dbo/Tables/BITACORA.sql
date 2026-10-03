CREATE TABLE [dbo].[BITACORA] (
    [id_bitacora]       INT            IDENTITY (1, 1) NOT NULL,
    [id_usuario]        INT            NOT NULL,
    [accion]            NVARCHAR (50)  NOT NULL,
    [registro_afectado] NVARCHAR (100) NULL,
    [fecha_hora]        DATETIME2 (7)  NOT NULL,
    [detalle]           NVARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([id_bitacora] ASC),
    CONSTRAINT [FK_BITACORA_USUARIO] FOREIGN KEY ([id_usuario]) REFERENCES [dbo].[USUARIO] ([id_usuario])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Registra acciones relevantes realizadas por los usuarios para fines de auditoría.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'BITACORA';

