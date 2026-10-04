import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Instructor } from '../../models/instructor.model';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-instructores',
  imports: [CommonModule, FormsModule],
  templateUrl: './instructores.html',
  styleUrl: './instructores.scss',
})
export class Instructores {
  instructor: Instructor = this.nuevoInstructor();
  instructores: Instructor[] = [];
  busqueda = '';

  get instructoresFiltrados(): Instructor[] {
    const texto = this.busqueda.trim().toLowerCase();
    if (!texto) return this.instructores;
    return this.instructores.filter(item => item.nombreCompleto.toLowerCase().includes(texto) || item.cedula.toLowerCase().includes(texto));
  }
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';
  editando = false;

  constructor(private instructorService: InstructorService, private cdr: ChangeDetectorRef) {
    this.obtenerInstructores();
  }

  obtenerInstructores(): void {
    this.instructorService.obtenerInstructores().subscribe({
      next: (respuesta) => {
        this.instructores = respuesta;
        this.cdr.detectChanges();
      }
    });
  }

  guardarInstructor(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.instructor.cedula || !this.instructor.nombreCompleto || !this.instructor.telefono || !this.instructor.zonaTrabajo || !this.instructor.tipoVehiculo || !this.instructor.disponibilidad || !this.instructor.estado) {
      this.mensaje = 'Debe completar todos los campos obligatorios.';
      this.tipoMensaje = 'error';
      return;
    }

    const solicitud = this.editando ? this.instructorService.actualizarInstructor(this.instructor) : this.instructorService.registrarInstructor(this.instructor);

    solicitud.subscribe({
      next: (respuesta) => {
        this.limpiarFormulario();
        this.mensaje = respuesta.mensaje;
        this.tipoMensaje = 'exito';
        this.obtenerInstructores();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = error.error?.mensaje ?? 'Ocurrió un error al guardar el instructor.';
        this.tipoMensaje = 'error';
        this.cdr.detectChanges();
      }
    });
  }

  editarInstructor(instructor: Instructor): void {
    this.instructor = { ...instructor };
    this.editando = true;
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  limpiar(): void {
    this.limpiarFormulario();
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  private limpiarFormulario(): void {
    this.instructor = this.nuevoInstructor();
    this.editando = false;
  }

  private nuevoInstructor(): Instructor {
    return { cedula: '', nombreCompleto: '', telefono: '', zonaTrabajo: 'Cartago', tipoVehiculo: 'Manual', disponibilidad: '', estado: 'Activo' };
  }
}