CREATE TABLE [dbo].[ZONA_DIA_DISPONIBLE] (
    [id_zona] INT NOT NULL,
    [dia_semana] TINYINT NOT NULL,
    PRIMARY KEY CLUSTERED ([id_zona], [dia_semana]),
    CONSTRAINT [FK_ZONA_DIA_DISPONIBLE_ZONA] FOREIGN KEY ([id_zona]) REFERENCES [dbo].[ZONA] ([id_zona]),
    -- ISO: lunes = 1, domingo = 7.
    CONSTRAINT [CK_ZONA_DIA_DISPONIBLE_Dia] CHECK ([dia_semana] BETWEEN 1 AND 7)
);
