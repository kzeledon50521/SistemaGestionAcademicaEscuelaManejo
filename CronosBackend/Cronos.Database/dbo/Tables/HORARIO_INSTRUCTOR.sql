CREATE TABLE [dbo].[HORARIO_INSTRUCTOR] (
    [id_horario] INT IDENTITY (1, 1) NOT NULL,
    [id_instructor] INT NOT NULL,
    [fecha] DATE NOT NULL,
    [hora] TIME (7) NOT NULL,
    [estado] NVARCHAR (20) NOT NULL,
    PRIMARY KEY CLUSTERED ([id_horario]),
    CONSTRAINT [FK_HORARIO_INSTRUCTOR_INSTRUCTOR] FOREIGN KEY ([id_instructor]) REFERENCES [dbo].[INSTRUCTOR] ([id_instructor]),
    CONSTRAINT [UQ_HORARIO_INSTRUCTOR_FechaHora] UNIQUE ([id_instructor], [fecha], [hora]),
    CONSTRAINT [CK_HORARIO_INSTRUCTOR_Estado] CHECK ([estado] IN (N'Activo', N'Inactivo'))
);
