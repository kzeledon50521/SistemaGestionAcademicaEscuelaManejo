import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Aprendiz } from '../../models/aprendiz.model';
import { AprendizService } from '../../services/aprendiz.service';

@Component({
  selector: 'app-aprendices',
  imports: [CommonModule, FormsModule],
  templateUrl: './aprendices.html',
  styleUrl: './aprendices.scss',
})
export class Aprendices {
  aprendiz: Aprendiz = this.nuevoAprendiz();
  aprendices: Aprendiz[] = [];
  busqueda = '';

  filtros = {
    cedula: '',
    nombreCompleto: '',
    telefono: '',
    zona: '',
    estado: '',
    progreso: ''
  };

  ordenCampo: keyof Aprendiz | '' = '';
  ordenAscendente = true;

  paginaActual = 1;
  tamanoPagina = 5;

  get aprendicesFiltrados(): Aprendiz[] {
    const texto = this.busqueda.trim().toLowerCase();

    let resultado = this.aprendices.filter(item =>
      (!texto ||
        item.nombreCompleto.toLowerCase().includes(texto) ||
        item.cedula.toLowerCase().includes(texto)) &&
      item.cedula.toLowerCase().includes(this.filtros.cedula.toLowerCase()) &&
      item.nombreCompleto.toLowerCase().includes(this.filtros.nombreCompleto.toLowerCase()) &&
      item.telefono.toLowerCase().includes(this.filtros.telefono.toLowerCase()) &&
      item.zona.toLowerCase().includes(this.filtros.zona.toLowerCase()) &&
      item.estado.toLowerCase().includes(this.filtros.estado.toLowerCase()) &&
      String(item.progreso ?? 0).includes(this.filtros.progreso)
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

  get aprendicesPaginados(): Aprendiz[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.aprendicesFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.aprendicesFiltrados.length / this.tamanoPagina));
  }

  ordenar(campo: keyof Aprendiz): void {
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

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(private aprendizService: AprendizService, private cdr: ChangeDetectorRef) {
    this.obtenerAprendices();
  }

  guardarAprendiz(): void {
    this.mensaje = '';
    this.tipoMensaje = '';

    if (!this.aprendiz.cedula || !this.aprendiz.nombreCompleto || !this.aprendiz.telefono || !this.aprendiz.correo || !this.aprendiz.zona || !this.aprendiz.estado) {
      this.mensaje = 'Debe completar todos los campos obligatorios.';
      this.tipoMensaje = 'error';
      return;
    }

    this.aprendizService.registrarAprendiz(this.aprendiz).subscribe({
      next: (respuesta) => {
        this.aprendiz = this.nuevoAprendiz();
        this.mensaje = respuesta.mensaje || 'Aprendiz registrado correctamente.';
        this.tipoMensaje = 'exito';
        this.obtenerAprendices();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = error.error?.mensaje ?? 'Ocurrió un error al registrar el aprendiz.';
        this.tipoMensaje = 'error';
        this.cdr.detectChanges();
      }
    });
  }

  obtenerAprendices(): void {
    this.aprendizService.obtenerAprendices().subscribe({
      next: (respuesta) => {
        this.aprendices = respuesta;
        this.cdr.detectChanges();
      }
    });
  }

  limpiar(): void {
    this.aprendiz = this.nuevoAprendiz();
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  private nuevoAprendiz(): Aprendiz {
    return { cedula: '', nombreCompleto: '', telefono: '', correo: '', zona: 'Cartago', estado: 'Activo' };
  }
}