import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgendaInstructor, HorarioDisponible, InstructorAgenda, Sesion, Zona } from '../models/agenda.model';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private apiUrl = 'https://localhost:7260/api/Agenda';

  constructor(private http: HttpClient) {}

  obtenerZonas(): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${this.apiUrl}/zonas`);
  }

  obtenerInstructores(zona: string): Observable<InstructorAgenda[]> {
    return this.http.get<InstructorAgenda[]>(`${this.apiUrl}/instructores`, {
      params: new HttpParams().set('zona', zona)
    });
  }

  obtenerHorarios(zona: string, idInstructor: number, fecha: string): Observable<HorarioDisponible[]> {
    let params = new HttpParams().set('zona', zona).set('idInstructor', idInstructor);
    if (fecha) params = params.set('fecha', fecha);
    return this.http.get<HorarioDisponible[]>(`${this.apiUrl}/horarios`, { params });
  }

  agendarHorario(idAprendiz: number, idHorario: number, zona: string): Observable<any> {
    let params = new HttpParams().set('idHorario', idHorario).set('idAprendiz', idAprendiz).set('zona',zona);
    return this.http.post(`${this.apiUrl}/agendar`, null,{ params });
  }

  obtenerSesionesAprendiz(idAprendiz: number): Observable<Sesion[]> {
    return this.http.get<Sesion[]>(`${this.apiUrl}/sesiones`, {
      params: new HttpParams().set('idAprendiz', idAprendiz)
    });
  }

  cancelarSesion(idSesion: number, idAprendiz: number): Observable<any> {
    const params = new HttpParams().set('idSesion', idSesion).set('idAprendiz', idAprendiz);
    return this.http.post(`${this.apiUrl}/cancelar`, null, { params });
  }

  obtenerAgendaInstructor(idInstructor: number, vista: 'semana' | 'mes', fecha: string): Observable<AgendaInstructor> {
    let params = new HttpParams().set('idInstructor', idInstructor).set('vista', vista);
    if (fecha) params = params.set('fecha', fecha);
    return this.http.get<AgendaInstructor>(`${this.apiUrl}/agenda-instructor`, { params });
  }
}
