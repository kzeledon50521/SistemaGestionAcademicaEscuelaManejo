import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aprendiz } from '../models/aprendiz.model';

@Injectable({
  providedIn: 'root'
})
export class AprendizService {

  private apiUrl = 'https://cronos-api-snk9.onrender.com/api/Aprendiz';

  constructor(private http: HttpClient) {}

  obtenerAprendices(): Observable<Aprendiz[]> {
    return this.http.get<Aprendiz[]>(this.apiUrl);
  }

  registrarAprendiz(aprendiz: Aprendiz): Observable<any> {
    return this.http.post(this.apiUrl, aprendiz);
  }
}