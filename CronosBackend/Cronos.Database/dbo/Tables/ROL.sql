CREATE TABLE [dbo].[ROL] (
    [id_rol]      INT            IDENTITY (1, 1) NOT NULL,
    [nombre]      NVARCHAR (50)  NOT NULL,
    [descripcion] NVARCHAR (200) NULL,
    PRIMARY KEY CLUSTERED ([id_rol] ASC),
    UNIQUE NONCLUSTERED ([nombre] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Almacena los roles disponibles para los usuarios del sistema.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'ROL';

