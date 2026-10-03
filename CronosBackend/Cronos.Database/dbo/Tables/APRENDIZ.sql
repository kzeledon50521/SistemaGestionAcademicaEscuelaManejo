CREATE TABLE [dbo].[APRENDIZ] (
    [id_aprendiz]     INT            IDENTITY (1, 1) NOT NULL,
    [id_usuario]      INT            NOT NULL,
    [cedula]          NVARCHAR (20)  NOT NULL,
    [nombre_completo] NVARCHAR (150) NOT NULL,
    [telefono]        NVARCHAR (20)  NOT NULL,
    [correo]          NVARCHAR (150) NOT NULL,
    [zona]            NVARCHAR (50)  NOT NULL,
    [estado]          NVARCHAR (20)  NOT NULL,
    PRIMARY KEY CLUSTERED ([id_aprendiz] ASC),
    CONSTRAINT [FK_APRENDIZ_USUARIO] FOREIGN KEY ([id_usuario]) REFERENCES [dbo].[USUARIO] ([id_usuario]),
    UNIQUE NONCLUSTERED ([cedula] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Almacena la información académica y de contacto de los aprendices.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'APRENDIZ';

