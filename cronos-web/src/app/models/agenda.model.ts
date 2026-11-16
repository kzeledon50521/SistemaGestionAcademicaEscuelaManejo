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


export interface Sesion {
  idSesion: number;
  idAprendiz: number;
  nombreAprendiz: string;
  idInstructor: number;
  nombreInstructor: string;
  zona: string;
  fecha: string;
  hora: string;
  estado: string;
}

export interface AgendaInstructor {
  vista: 'semana' | 'mes';
  desde: string;
  hasta: string;
  sesiones: Sesion[];
}
