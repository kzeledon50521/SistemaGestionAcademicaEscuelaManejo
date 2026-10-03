CREATE TABLE [dbo].[EVALUACION] (
    [id_evaluacion]   INT            IDENTITY (1, 1) NOT NULL,
    [id_aprendiz]     INT            NOT NULL,
    [id_instructor]   INT            NOT NULL,
    [fecha]           DATE           NOT NULL,
    [tipo_evaluacion] NVARCHAR (50)  NOT NULL,
    [nota]            DECIMAL (5, 2) NOT NULL,
    [resultado]       NVARCHAR (20)  NOT NULL,
    [observaciones]   NVARCHAR (500) NULL,
    PRIMARY KEY CLUSTERED ([id_evaluacion] ASC),
    CONSTRAINT [FK_EVALUACION_APRENDIZ] FOREIGN KEY ([id_aprendiz]) REFERENCES [dbo].[APRENDIZ] ([id_aprendiz]),
    CONSTRAINT [FK_EVALUACION_INSTRUCTOR] FOREIGN KEY ([id_instructor]) REFERENCES [dbo].[INSTRUCTOR] ([id_instructor])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Almacena las evaluaciones aplicadas a los aprendices por los instructores.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'EVALUACION';

