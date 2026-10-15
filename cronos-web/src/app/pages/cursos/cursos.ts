import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: 'app-cursos',
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrl: './cursos.scss',
})
export class Cursos {
  curso: Curso = this.nuevoCurso();
  cursos: Curso[] = [];

  get cursosActivos(): Curso[] {
    return this.cursos.filter(item => item.estado === 'Activo');
  }
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';
  editando = false;
  constructor(private cursoService: CursoService, private cdr: ChangeDetectorRef) {
    this.obtenerCursos();
  }

  obtenerCursos(): void {
    this.cursoService.obtenerCursos().subscribe({
      next: (respuesta) => {
        this.cursos = respuesta;
        this.cdr.detectChanges();
      }
    });
  }

  guardarCurso(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.curso.nombre || !this.curso.tipoVehiculo || this.curso.duracionHoras <= 0 || this.curso.precio <= 0 || !this.curso.estado) {
      this.mensaje = 'Debe completar todos los campos obligatorios correctamente.';
      this.tipoMensaje = 'error';
      return;
    }

    const solicitud = this.editando ? this.cursoService.actualizarCurso(this.curso) : this.cursoService.registrarCurso(this.curso);

    solicitud.subscribe({
      next: (respuesta) => {
        this.limpiarFormulario();
        this.mensaje = respuesta.mensaje;
        this.tipoMensaje = 'exito';
        this.obtenerCursos();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = error.error?.mensaje ?? 'Ocurrió un error al guardar el curso.';
        this.tipoMensaje = 'error';
        this.cdr.detectChanges();
      }
    });

    
  }


  limpiar(): void {
    this.limpiarFormulario();
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  private limpiarFormulario(): void {
    this.curso = this.nuevoCurso();
    this.editando = false;
  }

  private nuevoCurso(): Curso {
    return { nombre: '', descripcion: '', tipoVehiculo: 'Manual', duracionHoras: 0, precio: 0, estado: 'Activo' };
  }

  editarCurso(curso: Curso): void {
      this.curso = { ...curso };
      this.editando = true;
      this.mensaje = '';
      this.tipoMensaje = '';
    }
}

