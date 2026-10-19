import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Aprendiz } from '../../models/aprendiz.model';
import { Curso } from '../../models/curso.model';
import { Inscripcion } from '../../models/inscripcion.model';
import { AprendizService } from '../../services/aprendiz.service';
import { CursoService } from '../../services/curso.service';
import { InscripcionService } from '../../services/inscripcion.service';

@Component({
  selector: 'app-inscripciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './inscripciones.html',
  styleUrl: './inscripciones.scss',
})
export class Inscripciones {

  inscripcion: Inscripcion = this.nuevaInscripcion();
  inscripciones: Inscripcion[] = [];
  aprendices: Aprendiz[] = [];
  cursos: Curso[] = [];

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  get cursosDisponibles(): Curso[] {
    return this.cursos.filter(curso => curso.estado === 'Activo');
  }

  constructor(
    private inscripcionService: InscripcionService,
    private aprendizService: AprendizService,
    private cursoService: CursoService,
    private cdr: ChangeDetectorRef
  ) {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.aprendizService.obtenerAprendices().subscribe({
      next: respuesta => {
        this.aprendices = respuesta;
        this.cdr.detectChanges();
      }
    });

    this.cursoService.obtenerCursos().subscribe({
      next: respuesta => {
        this.cursos = respuesta;
        this.cdr.detectChanges();
      }
    });

    this.obtenerInscripciones();
  }

  obtenerInscripciones(): void {
    this.inscripcionService.obtenerInscripciones().subscribe({
      next: respuesta => {
        this.inscripciones = respuesta;
        this.cdr.detectChanges();
      }
    });
  }

  registrar(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.inscripcion.idAprendiz || !this.inscripcion.idCursoPaquete) {
      this.mensaje = 'Debe seleccionar un aprendiz y un curso.';
      this.tipoMensaje = 'error';
      return;
    }

    this.inscripcionService.registrarInscripcion(this.inscripcion).subscribe({
      next: respuesta => {
        this.mensaje = respuesta.mensaje;
        this.tipoMensaje = 'exito';
        this.inscripcion = this.nuevaInscripcion();
        this.obtenerInscripciones();
        this.cdr.detectChanges();
      },
      error: error => {
        this.mensaje = error.error?.mensaje ?? 'Ocurrió un error al registrar la solicitud.';
        this.tipoMensaje = 'error';
        this.cdr.detectChanges();
      }
    });
  }

  aprobar(solicitud: Inscripcion): void {
    this.cambiarEstado(solicitud, 'Aprobada');
  }

  rechazar(solicitud: Inscripcion): void {
    this.cambiarEstado(solicitud, 'Rechazada');
  }

  private cambiarEstado(solicitud: Inscripcion, estado: string): void {
    if (!solicitud.idInscripcion) return;

    this.inscripcionService
      .actualizarEstado(solicitud.idInscripcion, estado)
      .subscribe({
        next: respuesta => {
          this.mensaje = respuesta.mensaje;
          this.tipoMensaje = 'exito';
          this.obtenerInscripciones();
        },
        error: error => {
          this.mensaje =
            error.error?.mensaje ?? 'No fue posible actualizar la solicitud.';
          this.tipoMensaje = 'error';
        }
      });
  }

  limpiar(): void {
    this.inscripcion = this.nuevaInscripcion();
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  private nuevaInscripcion(): Inscripcion {
    return {
      idAprendiz: 0,
      idCursoPaquete: 0
    };
  }
}