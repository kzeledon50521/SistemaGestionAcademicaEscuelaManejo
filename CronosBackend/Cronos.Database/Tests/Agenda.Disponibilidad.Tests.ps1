param([string]$Servidor = 'lpc:localhost')

$ErrorActionPreference = 'Stop'
$databaseRoot = Split-Path $PSScriptRoot -Parent
$sqlParts = [System.Collections.Generic.List[string]]::new()
$sqlParts.Add(@'
SET NOCOUNT ON;
CREATE TABLE #ZONA (id_zona INT PRIMARY KEY, nombre NVARCHAR(50));
CREATE TABLE #ZONA_DIA_DISPONIBLE (id_zona INT, dia_semana TINYINT, PRIMARY KEY (id_zona, dia_semana));
CREATE TABLE #INSTRUCTOR (id_instructor INT PRIMARY KEY, nombre_completo NVARCHAR(150), zona_trabajo NVARCHAR(50), estado NVARCHAR(20));
CREATE TABLE #HORARIO_INSTRUCTOR (id_horario INT PRIMARY KEY, id_instructor INT, fecha DATE, hora TIME(7), estado NVARCHAR(20));
CREATE TABLE #SESION_PRACTICA (id_instructor INT, fecha DATE, hora TIME(7), estado NVARCHAR(20));
GO
'@)

# Ejecuta el SQL de producción sobre objetos temporales de esta conexión.
# No lee datos de negocio ni crea/modifica objetos persistentes.
foreach ($nombre in @('Zonas', 'Instructores', 'Horarios')) {
    $sql = Get-Content -LiteralPath (Join-Path $databaseRoot "dbo/Stored Procedures/sp_Agenda_Consultar$nombre.sql") -Raw -Encoding UTF8
    $sql = $sql.Replace("dbo.sp_Agenda_Consultar$nombre", "#sp_Agenda_Consultar$nombre")
    foreach ($tabla in @('ZONA_DIA_DISPONIBLE', 'HORARIO_INSTRUCTOR', 'SESION_PRACTICA', 'INSTRUCTOR', 'ZONA')) {
        $sql = $sql.Replace("dbo.$tabla", "#$tabla")
    }
    $sqlParts.Add($sql + "`nGO`n")
}

$catalogo = Get-Content -LiteralPath (Join-Path $databaseRoot 'Scripts/PostDeployment.sql') -Raw -Encoding UTF8
# El catálogo usa IDENTITY en producción; para este fixture se asignan los IDs.
$catalogo = $catalogo.Replace('dbo.ZONA_DIA_DISPONIBLE', '#ZONA_DIA_DISPONIBLE').Replace('dbo.ZONA', '#ZONA')
$catalogo = $catalogo.Replace('INSERT INTO #ZONA (nombre)', 'INSERT INTO #ZONA (id_zona, nombre)')
$catalogo = $catalogo.Replace('SELECT V.nombre', 'SELECT ROW_NUMBER() OVER (ORDER BY V.nombre), V.nombre')
$sqlParts.Add($catalogo + "`nGO`n" + $catalogo + "`nGO`n")
$sqlParts.Add((Get-Content -LiteralPath (Join-Path $PSScriptRoot 'Agenda.Disponibilidad.Tests.sql') -Raw -Encoding UTF8))

$archivoTemporal = Join-Path ([System.IO.Path]::GetTempPath()) ('cronos-agenda-' + [guid]::NewGuid().ToString('N') + '.sql')
try {
    [System.IO.File]::WriteAllText($archivoTemporal, ($sqlParts -join "`n"), [System.Text.UTF8Encoding]::new($true))
    & sqlcmd -S $Servidor -E -C -b -l 5 -i $archivoTemporal
    if ($LASTEXITCODE -ne 0) { throw 'Fallaron las pruebas SQL de disponibilidad.' }
}
finally {
    if (Test-Path -LiteralPath $archivoTemporal) { Remove-Item -LiteralPath $archivoTemporal }
}
