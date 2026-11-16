-- Fixture sintético. Ejecutar mediante Agenda.Disponibilidad.Tests.ps1.
IF (SELECT COUNT(*) FROM #ZONA) <> 3 OR (SELECT COUNT(*) FROM #ZONA_DIA_DISPONIBLE) <> 20
    THROW 51000, 'El catálogo debe ser idempotente: 3 zonas y 20 días permitidos.', 1;

DECLARE @Cartago INT = (SELECT id_zona FROM #ZONA WHERE nombre = N'Cartago');
DECLARE @Jose INT = (SELECT id_zona FROM #ZONA WHERE nombre = N'San José');
DECLARE @Heredia INT = (SELECT id_zona FROM #ZONA WHERE nombre = N'Heredia');
IF EXISTS (SELECT 1 FROM #ZONA_DIA_DISPONIBLE WHERE id_zona = @Cartago AND dia_semana = 7)
    THROW 51000, 'Cartago no admite domingo.', 1;

INSERT INTO #INSTRUCTOR VALUES
    (1, N'Prueba Cartago', N'Cartago', N'Activo'),
    (2, N'Prueba San José', N'San José', N'Activo'),
    (3, N'Prueba Heredia', N'Heredia', N'Activo'),
    (4, N'Prueba inactivo', N'Cartago', N'Inactivo'),
    (5, N'Prueba sin horarios', N'Cartago', N'Activo');

DECLARE @Ahora DATETIME2(7) = CONVERT(DATETIME2(7),
    SYSUTCDATETIME() AT TIME ZONE 'UTC' AT TIME ZONE 'Central America Standard Time');
DECLARE @Base DATE = DATEADD(DAY, 14, CONVERT(DATE, @Ahora));
DECLARE @Lunes DATE = DATEADD(DAY, -((DATEDIFF(DAY, CONVERT(DATE, '19000101', 112), @Base) % 7 + 7) % 7), @Base);

INSERT INTO #HORARIO_INSTRUCTOR
SELECT I.id_instructor * 100 + D.numero, I.id_instructor, DATEADD(DAY, D.numero, @Lunes), '09:00', N'Activo'
FROM #INSTRUCTOR I
CROSS JOIN (VALUES (0), (1), (2), (3), (4), (5), (6)) D(numero)
WHERE I.id_instructor <= 4;

INSERT INTO #HORARIO_INSTRUCTOR VALUES
    (901, 1, DATEADD(DAY, -1, CONVERT(DATE, @Ahora)), '09:00', N'Activo'),
    (902, 1, @Lunes, '10:00', N'Inactivo'),
    (903, 1, @Lunes, '11:00', N'Activo'),
    (904, 1, @Lunes, '12:00', N'Activo'),
    (905, 1, CONVERT(DATE, @Ahora), '00:00', N'Activo');
INSERT INTO #SESION_PRACTICA VALUES
    (1, @Lunes, '11:00', N'Programada'),
    (1, @Lunes, '12:00', N'Cancelada'),
    (2, @Lunes, '09:00', N'Programada');

CREATE TABLE #Resultado (
    IdHorario INT, IdInstructor INT, NombreInstructor NVARCHAR(150),
    Zona NVARCHAR(50), Fecha CHAR(10), Hora VARCHAR(16)
);
CREATE TABLE #ListaInstructores (IdInstructor INT, NombreCompleto NVARCHAR(150));
INSERT INTO #ListaInstructores EXEC #sp_Agenda_ConsultarInstructores @Zona = N'Cartago';
IF (SELECT COUNT(*) FROM #ListaInstructores) <> 2
   OR EXISTS (SELECT 1 FROM #ListaInstructores WHERE IdInstructor NOT IN (1, 5))
    THROW 51000, 'La lista debe contener solo instructores activos de Cartago.', 1;

-- DATEFIRST no debe alterar los días permitidos.
SET DATEFIRST 7;
INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'Cartago', @IdInstructor = 1;
IF (SELECT COUNT(*) FROM #Resultado) <> 6
   OR EXISTS (SELECT 1 FROM #Resultado WHERE IdInstructor <> 1 OR IdHorario IN (106, 901, 902, 903, 904, 905))
    THROW 51000, 'Cartago: lunes a sábado, solo instructor elegido, sin ocupados/inactivos/pasados.', 1;
TRUNCATE TABLE #Resultado;
SET DATEFIRST 1;
INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'Cartago', @IdInstructor = 1;
IF (SELECT COUNT(*) FROM #Resultado) <> 6
    THROW 51000, 'El resultado no debe depender de DATEFIRST.', 1;

TRUNCATE TABLE #Resultado;
INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'San José', @IdInstructor = 2;
IF (SELECT COUNT(*) FROM #Resultado) <> 6 OR NOT EXISTS (SELECT 1 FROM #Resultado WHERE IdHorario = 206)
   OR EXISTS (SELECT 1 FROM #Resultado WHERE IdHorario = 200)
    THROW 51000, 'San José: domingo permitido y sesión ocupada excluida.', 1;

TRUNCATE TABLE #Resultado;
INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'Heredia', @IdInstructor = 3;
IF (SELECT COUNT(*) FROM #Resultado) <> 7 OR NOT EXISTS (SELECT 1 FROM #Resultado WHERE IdHorario = 306)
    THROW 51000, 'Heredia debe permitir los siete días.', 1;

TRUNCATE TABLE #Resultado;
INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'Cartago', @IdInstructor = 4;
IF EXISTS (SELECT 1 FROM #Resultado)
    THROW 51000, 'Un instructor inactivo no debe devolver horarios.', 1;
INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'Heredia', @IdInstructor = 1;
IF EXISTS (SELECT 1 FROM #Resultado)
    THROW 51000, 'Un instructor de otra zona no debe devolver horarios.', 1;
INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'Cartago', @IdInstructor = 5;
IF EXISTS (SELECT 1 FROM #Resultado)
    THROW 51000, 'Sin horarios configurados se devuelve lista vacía.', 1;

INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'Cartago', @IdInstructor = 1, @Fecha = @Lunes;
IF (SELECT COUNT(*) FROM #Resultado) <> 1 OR NOT EXISTS (SELECT 1 FROM #Resultado WHERE IdHorario = 100)
    THROW 51000, 'La fecha debe filtrar sin devolver ocupados ni horarios de otro instructor.', 1;
TRUNCATE TABLE #Resultado;
DECLARE @Pasado DATE = DATEADD(DAY, -1, CONVERT(DATE, @Ahora));
INSERT INTO #Resultado EXEC #sp_Agenda_ConsultarHorarios @Zona = N'Cartago', @IdInstructor = 1, @Fecha = @Pasado;
IF EXISTS (SELECT 1 FROM #Resultado)
    THROW 51000, 'SQL tampoco debe devolver fechas pasadas.', 1;

PRINT 'Pruebas SQL correctas: catálogo, tres zonas, DATEFIRST, ocupación, cancelaciones, fechas, aislamiento por instructor y estados.';
