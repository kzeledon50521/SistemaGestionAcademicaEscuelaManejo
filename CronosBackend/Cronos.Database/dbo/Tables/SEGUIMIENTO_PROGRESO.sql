CREATE TABLE [dbo].[SEGUIMIENTO_PROGRESO] (
    [id_seguimiento]          INT            IDENTITY (1, 1) NOT NULL,
    [id_aprendiz]             INT            NOT NULL,
    [evaluaciones_realizadas] INT            NOT NULL,
    [promedio]                DECIMAL (5, 2) NOT NULL,
    [sesiones_completadas]    INT            NOT NULL,
    [indice_preparacion]      DECIMAL (5, 2) NOT NULL,
    [estado]                  NVARCHAR (20)  NOT NULL,
    PRIMARY KEY CLUSTERED ([id_seguimiento] ASC),
    CONSTRAINT [FK_SEGUIMIENTO_APRENDIZ] FOREIGN KEY ([id_aprendiz]) REFERENCES [dbo].[APRENDIZ] ([id_aprendiz]),
    UNIQUE NONCLUSTERED ([id_aprendiz] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Almacena indicadores relacionados con el progreso y preparación del aprendiz.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'SEGUIMIENTO_PROGRESO';

