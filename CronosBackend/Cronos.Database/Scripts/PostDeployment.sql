-- Solo catálogo/reglas de la HU. Los horarios deben cargarse con datos autorizados.
SET XACT_ABORT ON;
BEGIN TRANSACTION;

INSERT INTO dbo.ZONA (nombre)
SELECT V.nombre
FROM (VALUES (N'Cartago'), (N'San José'), (N'Heredia')) V(nombre)
WHERE NOT EXISTS (SELECT 1 FROM dbo.ZONA Z WHERE Z.nombre = V.nombre);

INSERT INTO dbo.ZONA_DIA_DISPONIBLE (id_zona, dia_semana)
SELECT Z.id_zona, D.dia
FROM dbo.ZONA Z
CROSS JOIN (VALUES (1), (2), (3), (4), (5), (6), (7)) D(dia)
WHERE (Z.nombre = N'Cartago' AND D.dia <= 6
       OR Z.nombre IN (N'San José', N'Heredia'))
  AND NOT EXISTS (
      SELECT 1 FROM dbo.ZONA_DIA_DISPONIBLE R
      WHERE R.id_zona = Z.id_zona AND R.dia_semana = D.dia
  );

COMMIT TRANSACTION;
