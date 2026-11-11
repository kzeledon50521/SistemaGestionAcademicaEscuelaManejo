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

  filtros = {
    cedula: '',
    nombreCompleto: '',
    zonaTrabajo: '',
    tipoVehiculo: '',
    disponibilidad: '',
    estado: ''
  };

  ordenCampo: keyof Instructor | '' = '';
  ordenAscendente = true;

  paginaActual = 1;
  tamanoPagina = 5;

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';
  editando = false;

  get instructoresFiltrados(): Instructor[] {
    const texto = this.busqueda.trim().toLowerCase();

    let resultado = this.instructores.filter(item =>
      (!texto ||
        item.nombreCompleto.toLowerCase().includes(texto) ||
        item.cedula.toLowerCase().includes(texto)) &&
      item.cedula.toLowerCase().includes(this.filtros.cedula.toLowerCase()) &&
      item.nombreCompleto.toLowerCase().includes(this.filtros.nombreCompleto.toLowerCase()) &&
      item.zonaTrabajo.toLowerCase().includes(this.filtros.zonaTrabajo.toLowerCase()) &&
      item.tipoVehiculo.toLowerCase().includes(this.filtros.tipoVehiculo.toLowerCase()) &&
      item.disponibilidad.toLowerCase().includes(this.filtros.disponibilidad.toLowerCase()) &&
      item.estado.toLowerCase().includes(this.filtros.estado.toLowerCase())
    );

    if (this.ordenCampo) {
      const campo = this.ordenCampo;

      resultado = [...resultado].sort((a, b) => {
        const valorA = a[campo] ?? '';
        const valorB = b[campo] ?? '';

        const comparacion = String(valorA).localeCompare(
          String(valorB),
          'es',
          { numeric: true, sensitivity: 'base' }
        );

        return this.ordenAscendente ? comparacion : -comparacion;
      });
    }

    return resultado;
  }

  get instructoresPaginados(): Instructor[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.instructoresFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.instructoresFiltrados.length / this.tamanoPagina));
  }

  constructor(
    private instructorService: InstructorService,
    private cdr: ChangeDetectorRef
  ) {
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

  ordenar(campo: keyof Instructor): void {
    if (this.ordenCampo === campo) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.ordenCampo = campo;
      this.ordenAscendente = true;
    }

    this.paginaActual = 1;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  guardarInstructor(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.instructor.cedula ||
        !this.instructor.nombreCompleto ||
        !this.instructor.telefono ||
        !this.instructor.zonaTrabajo ||
        !this.instructor.tipoVehiculo ||
        !this.instructor.disponibilidad ||
        !this.instructor.estado) {
      this.mensaje = 'Debe completar todos los campos obligatorios.';
      this.tipoMensaje = 'error';
      return;
    }

    const solicitud = this.editando
      ? this.instructorService.actualizarInstructor(this.instructor)
      : this.instructorService.registrarInstructor(this.instructor);

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
    return {
      cedula: '',
      nombreCompleto: '',
      telefono: '',
      zonaTrabajo: 'Cartago',
      tipoVehiculo: 'Manual',
      disponibilidad: '',
      estado: 'Activo'
    };
  }
}