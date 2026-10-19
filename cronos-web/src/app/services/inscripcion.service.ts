import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion } from '../models/inscripcion.model';

@Injectable({
    providedIn: 'root'
})
export class InscripcionService {

    private apiUrl = 'https://cronos-api-snk9.onrender.com/api/Inscripcion';

    constructor(private http: HttpClient) { }

    obtenerInscripciones(): Observable<Inscripcion[]> {
        return this.http.get<Inscripcion[]>(this.apiUrl);
    }

    registrarInscripcion(inscripcion: Inscripcion): Observable<any> {
        return this.http.post(this.apiUrl, inscripcion);
    }

    actualizarEstado(idInscripcion: number, estadoSolicitud: string): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/${idInscripcion}/estado`,
            { estadoSolicitud }
        );
    }
}