import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'https://cronos-api-snk9.onrender.com/api/Curso';

  constructor(private http: HttpClient) {}

  obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  registrarCurso(curso: Curso): Observable<any> {
    return this.http.post(this.apiUrl, curso);
  }
}