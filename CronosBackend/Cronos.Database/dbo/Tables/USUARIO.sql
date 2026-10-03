CREATE TABLE [dbo].[USUARIO] (
    [id_usuario]      INT            IDENTITY (1, 1) NOT NULL,
    [id_rol]          INT            NOT NULL,
    [nombre_completo] NVARCHAR (150) NOT NULL,
    [correo]          NVARCHAR (150) NOT NULL,
    [contrasena_hash] NVARCHAR (255) NOT NULL,
    [estado]          NVARCHAR (20)  NOT NULL,
    PRIMARY KEY CLUSTERED ([id_usuario] ASC),
    CONSTRAINT [FK_USUARIO_ROL] FOREIGN KEY ([id_rol]) REFERENCES [dbo].[ROL] ([id_rol]),
    UNIQUE NONCLUSTERED ([correo] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Almacena los usuarios, sus credenciales, estado y rol dentro del sistema.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'USUARIO';

