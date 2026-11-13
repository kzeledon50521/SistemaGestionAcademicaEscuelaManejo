export interface Zona {
  idZona: number;
  nombre: string;
}

export interface InstructorAgenda {
  idInstructor: number;
  nombreCompleto: string;
}

export interface HorarioDisponible {
  idHorario: number;
  idInstructor: number;
  nombreInstructor: string;
  zona: string;
  fecha: string;
  hora: string;
  estado: string;
}
