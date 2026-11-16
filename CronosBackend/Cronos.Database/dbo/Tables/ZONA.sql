CREATE TABLE [dbo].[ZONA] (
    [id_zona] INT IDENTITY (1, 1) NOT NULL,
    [nombre] NVARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([id_zona]),
    CONSTRAINT [UQ_ZONA_Nombre] UNIQUE ([nombre])
);
