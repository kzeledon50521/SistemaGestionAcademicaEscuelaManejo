CREATE TABLE [dbo].[CURSO_PAQUETE] (
    [id_curso_paquete] INT             IDENTITY (1, 1) NOT NULL,
    [nombre]           NVARCHAR (100)  NOT NULL,
    [descripcion]      NVARCHAR (500)  NULL,
    [tipo_vehiculo]    NVARCHAR (30)   NOT NULL,
    [duracion_horas]   INT             NOT NULL,
    [precio]           DECIMAL (10, 2) NOT NULL,
    [estado]           NVARCHAR (20)   NOT NULL,
    PRIMARY KEY CLUSTERED ([id_curso_paquete] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Almacena los cursos o paquetes de manejo disponibles en la autoescuela.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'CURSO_PAQUETE';

