export interface Inscripcion {
  idInscripcion?: number;
  idAprendiz: number;
  idCursoPaquete: number;
  fechaSolicitud?: string;
  estadoSolicitud?: string;
  nombreAprendiz?: string;
  nombreCurso?: string;
}