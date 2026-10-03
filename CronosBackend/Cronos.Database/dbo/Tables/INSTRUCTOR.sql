CREATE TABLE [dbo].[INSTRUCTOR] (
    [id_instructor]   INT            IDENTITY (1, 1) NOT NULL,
    [id_usuario]      INT            NOT NULL,
    [cedula]          NVARCHAR (20)  NOT NULL,
    [nombre_completo] NVARCHAR (150) NOT NULL,
    [telefono]        NVARCHAR (20)  NOT NULL,
    [zona_trabajo]    NVARCHAR (50)  NOT NULL,
    [tipo_vehiculo]   NVARCHAR (30)  NOT NULL,
    [disponibilidad]  NVARCHAR (200) NULL,
    [estado]          NVARCHAR (20)  NOT NULL,
    PRIMARY KEY CLUSTERED ([id_instructor] ASC),
    CONSTRAINT [FK_INSTRUCTOR_USUARIO] FOREIGN KEY ([id_usuario]) REFERENCES [dbo].[USUARIO] ([id_usuario]),
    UNIQUE NONCLUSTERED ([cedula] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Almacena los datos, zona de trabajo y disponibilidad de los instructores.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'INSTRUCTOR';

