-- 1. Eliminar la restricción actual
ALTER TABLE [dbo].[HORARIO_INSTRUCTOR] 
DROP CONSTRAINT [CK_HORARIO_INSTRUCTOR_Estado];
GO

-- 2. Crear la restricción actualizada con los nuevos valores
ALTER TABLE [dbo].[HORARIO_INSTRUCTOR] 
ADD CONSTRAINT [CK_HORARIO_INSTRUCTOR_Estado] 
CHECK ([estado] IN (N'Activo', N'Inactivo', N'Agendado', N'Traslado'));
GO