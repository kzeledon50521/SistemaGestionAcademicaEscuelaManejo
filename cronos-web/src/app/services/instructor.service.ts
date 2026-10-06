import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor } from '../models/instructor.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = 'https://cronos-api-snk9.onrender.com/api/Instructor';

  constructor(private http: HttpClient) {}

  obtenerInstructores(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.apiUrl);
  }

  registrarInstructor(instructor: Instructor): Observable<any> {
    return this.http.post(this.apiUrl, instructor);
  }

  actualizarInstructor(instructor: Instructor): Observable<any> {
    return this.http.put(this.apiUrl, instructor);
  }
}