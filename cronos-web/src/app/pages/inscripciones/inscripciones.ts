import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
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
  busquedaAprendiz = '';
  mostrarAprendices = false;

  filtros = {
    nombreAprendiz: '',
    nombreCurso: '',
    fechaSolicitud: '',
    estadoSolicitud: ''
  };

  ordenCampo: keyof Inscripcion | '' = '';
  ordenAscendente = true;

  paginaActual = 1;
  tamanoPagina = 5;

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  get cursosDisponibles(): Curso[] {
    return this.cursos.filter(curso => curso.estado === 'Activo');
  }

  get aprendicesFiltradosSelector(): Aprendiz[] {
    const texto = this.busquedaAprendiz.trim().toLowerCase();

    if (!texto) {
      return this.aprendices;
    }

    return this.aprendices.filter(aprendiz =>
      aprendiz.nombreCompleto.toLowerCase().includes(texto)
    );
  }

  buscarAprendiz(): void {
    this.inscripcion.idAprendiz = 0;
    this.mostrarAprendices = true;
  }

  seleccionarAprendiz(aprendiz: Aprendiz): void {
    this.inscripcion.idAprendiz = aprendiz.idAprendiz ?? 0;
    this.busquedaAprendiz = aprendiz.nombreCompleto;
    this.mostrarAprendices = false;
  }

  @HostListener('document:click')
  cerrarSelectorAprendiz(): void {
    this.mostrarAprendices = false;
  }

  get inscripcionesFiltradas(): Inscripcion[] {
    let resultado = this.inscripciones.filter(item =>
      String(item.nombreAprendiz ?? '').toLowerCase()
        .includes(this.filtros.nombreAprendiz.toLowerCase()) &&
      String(item.nombreCurso ?? '').toLowerCase()
        .includes(this.filtros.nombreCurso.toLowerCase()) &&
      String(item.fechaSolicitud ?? '').toLowerCase()
        .includes(this.filtros.fechaSolicitud.toLowerCase()) &&
      String(item.estadoSolicitud ?? '').toLowerCase()
        .includes(this.filtros.estadoSolicitud.toLowerCase())
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

  get inscripcionesPaginadas(): Inscripcion[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.inscripcionesFiltradas.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.inscripcionesFiltradas.length / this.tamanoPagina));
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

  ordenar(campo: keyof Inscripcion): void {
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

    this.inscripcionService.actualizarEstado(
      solicitud.idInscripcion,
      estado
    ).subscribe({
      next: respuesta => {
        this.mensaje = respuesta.mensaje;
        this.tipoMensaje = 'exito';
        this.obtenerInscripciones();
      },
      error: error => {
        this.mensaje = error.error?.mensaje ?? 'No fue posible actualizar la solicitud.';
        this.tipoMensaje = 'error';
      }
    });
  }

  limpiar(): void {
    this.inscripcion = this.nuevaInscripcion();
    this.busquedaAprendiz = '';
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