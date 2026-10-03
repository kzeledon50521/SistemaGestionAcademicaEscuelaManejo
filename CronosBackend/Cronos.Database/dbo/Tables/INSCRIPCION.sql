CREATE TABLE [dbo].[INSCRIPCION] (
    [id_inscripcion]   INT           IDENTITY (1, 1) NOT NULL,
    [id_aprendiz]      INT           NOT NULL,
    [id_curso_paquete] INT           NOT NULL,
    [fecha_solicitud]  DATE          NOT NULL,
    [estado_solicitud] NVARCHAR (20) NOT NULL,
    PRIMARY KEY CLUSTERED ([id_inscripcion] ASC),
    CONSTRAINT [FK_INSCRIPCION_APRENDIZ] FOREIGN KEY ([id_aprendiz]) REFERENCES [dbo].[APRENDIZ] ([id_aprendiz]),
    CONSTRAINT [FK_INSCRIPCION_CURSO] FOREIGN KEY ([id_curso_paquete]) REFERENCES [dbo].[CURSO_PAQUETE] ([id_curso_paquete])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Registra las solicitudes e inscripciones de los aprendices a cursos o paquetes.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'INSCRIPCION';

