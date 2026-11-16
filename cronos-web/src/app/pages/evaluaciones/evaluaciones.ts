import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SeguimientoEvaluacion {
  aprendiz: string;
  evaluaciones: number;
  promedio: number;
  sesionesCompletadas: number;
  indicePreparacion: number;
  estado: string;
}

@Component({
  selector: 'app-evaluaciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluaciones.html',
  styleUrl: './evaluaciones.scss',
})
export class Evaluaciones {
  aprendices = ['Kendall Zeledón', 'José Guillén'];
  instructores = ['Cristopher Durán', 'María Rodríguez'];

  busquedaAprendiz = '';
  busquedaInstructor = '';

  mostrarAprendices = false;
  mostrarInstructores = false;

  get aprendicesFiltrados(): string[] {
    const texto = this.busquedaAprendiz.trim().toLowerCase();

    return this.aprendices.filter(item =>
      item.toLowerCase().includes(texto)
    );
  }

  get instructoresFiltrados(): string[] {
    const texto = this.busquedaInstructor.trim().toLowerCase();

    return this.instructores.filter(item =>
      item.toLowerCase().includes(texto)
    );
  }

  seleccionarAprendiz(aprendiz: string): void {
    this.busquedaAprendiz = aprendiz;
    this.mostrarAprendices = false;
  }

  seleccionarInstructor(instructor: string): void {
    this.busquedaInstructor = instructor;
    this.mostrarInstructores = false;
  }

  @HostListener('document:click')
  cerrarSelectores(): void {
    this.mostrarAprendices = false;
    this.mostrarInstructores = false;
  }
  seguimientos: SeguimientoEvaluacion[] = [
    {
      aprendiz: 'Kendall Zeledón',
      evaluaciones: 5,
      promedio: 88,
      sesionesCompletadas: 8,
      indicePreparacion: 82,
      estado: 'Preparado'
    },
    {
      aprendiz: 'José Guillén',
      evaluaciones: 3,
      promedio: 72,
      sesionesCompletadas: 5,
      indicePreparacion: 65,
      estado: 'En proceso'
    }
  ];

  filtros = {
    aprendiz: '',
    evaluaciones: '',
    promedio: '',
    sesionesCompletadas: '',
    indicePreparacion: '',
    estado: ''
  };

  ordenCampo: keyof SeguimientoEvaluacion | '' = '';
  ordenAscendente = true;

  paginaActual = 1;
  tamanoPagina = 5;

  get seguimientosFiltrados(): SeguimientoEvaluacion[] {
    let resultado = this.seguimientos.filter(item =>
      item.aprendiz.toLowerCase().includes(this.filtros.aprendiz.toLowerCase()) &&
      String(item.evaluaciones).includes(this.filtros.evaluaciones) &&
      String(item.promedio).includes(this.filtros.promedio) &&
      String(item.sesionesCompletadas).includes(this.filtros.sesionesCompletadas) &&
      String(item.indicePreparacion).includes(this.filtros.indicePreparacion) &&
      item.estado.toLowerCase().includes(this.filtros.estado.toLowerCase())
    );

    if (this.ordenCampo) {
      const campo = this.ordenCampo;

      resultado = [...resultado].sort((a, b) => {
        const comparacion = String(a[campo]).localeCompare(
          String(b[campo]),
          'es',
          { numeric: true, sensitivity: 'base' }
        );

        return this.ordenAscendente ? comparacion : -comparacion;
      });
    }

    return resultado;
  }

  get seguimientosPaginados(): SeguimientoEvaluacion[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.seguimientosFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.seguimientosFiltrados.length / this.tamanoPagina));
  }

  ordenar(campo: keyof SeguimientoEvaluacion): void {
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
}