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

  filtros = {
    nombre: '',
    descripcion: '',
    tipoVehiculo: '',
    duracionHoras: '',
    precio: '',
    estado: ''
  };

  ordenCampo: keyof Curso | '' = '';
  ordenAscendente = true;

  paginaActual = 1;
  tamanoPagina = 5;

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';
  mensajeListado = '';
  tipoMensajeListado: 'exito' | 'error' | '' = '';
  editando = false;

  get cursosFiltrados(): Curso[] {
    let resultado = this.cursos.filter(item =>
      item.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase()) &&
      item.descripcion.toLowerCase().includes(this.filtros.descripcion.toLowerCase()) &&
      item.tipoVehiculo.toLowerCase().includes(this.filtros.tipoVehiculo.toLowerCase()) &&
      String(item.duracionHoras).includes(this.filtros.duracionHoras) &&
      String(item.precio).includes(this.filtros.precio) &&
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

  get cursosPaginados(): Curso[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.cursosFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.cursosFiltrados.length / this.tamanoPagina));
  }

  constructor(
    private cursoService: CursoService,
    private cdr: ChangeDetectorRef
  ) {
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

  ordenar(campo: keyof Curso): void {
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

  guardarCurso(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.curso.nombre ||
        !this.curso.tipoVehiculo ||
        this.curso.duracionHoras <= 0 ||
        this.curso.precio <= 0 ||
        !this.curso.estado) {
      this.mensaje = 'Debe completar todos los campos obligatorios correctamente.';
      this.tipoMensaje = 'error';
      return;
    }

    const solicitud = this.editando
      ? this.cursoService.actualizarCurso(this.curso)
      : this.cursoService.registrarCurso(this.curso);

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

  deshabilitarCurso(item: Curso): void {
    this.mensajeListado = '';
    this.tipoMensajeListado = '';

    if (!item.idCursoPaquete || item.estado !== 'Activo') return;

    if (!confirm(`¿Desea deshabilitar el curso "${item.nombre}"? No estará disponible para nuevas inscripciones, pero se conservará su historial.`)) {
      return;
    }

    this.cursoService.deshabilitarCurso(item.idCursoPaquete).subscribe({
      next: (respuesta) => {
        this.mensajeListado = respuesta.mensaje;
        this.tipoMensajeListado = 'exito';
        this.obtenerCursos();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensajeListado = error.error?.mensaje ?? 'Ocurrió un error al deshabilitar el curso.';
        this.tipoMensajeListado = 'error';
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
    return {
      nombre: '',
      descripcion: '',
      tipoVehiculo: 'Manual',
      duracionHoras: 0,
      precio: 0,
      estado: 'Activo'
    };
  }

  editarCurso(curso: Curso): void {
    this.curso = { ...curso };
    this.editando = true;
    this.mensaje = '';
    this.tipoMensaje = '';
  }
}