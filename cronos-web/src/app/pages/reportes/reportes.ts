import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ResultadoReporte {
  elemento: string;
  detalle: string;
  promedio: number;
  estado: string;
  observacion: string;
}

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes {
  resultados: ResultadoReporte[] = [
    {
      elemento: 'Kendall Zeledón',
      detalle: 'Seguimiento de aprendiz',
      promedio: 88,
      estado: 'Adecuado',
      observacion: 'Presenta buen avance para el examen práctico.'
    },
    {
      elemento: 'José Guillén',
      detalle: 'Seguimiento de aprendiz',
      promedio: 72,
      estado: 'En proceso',
      observacion: 'Requiere reforzar maniobras y control del vehículo.'
    }
  ];

  filtros = {
    elemento: '',
    detalle: '',
    promedio: '',
    estado: '',
    observacion: ''
  };

  ordenCampo: keyof ResultadoReporte | '' = '';
  ordenAscendente = true;

  paginaActual = 1;
  tamanoPagina = 5;

  get resultadosFiltrados(): ResultadoReporte[] {
    let resultado = this.resultados.filter(item =>
      item.elemento.toLowerCase().includes(this.filtros.elemento.toLowerCase()) &&
      item.detalle.toLowerCase().includes(this.filtros.detalle.toLowerCase()) &&
      String(item.promedio).includes(this.filtros.promedio) &&
      item.estado.toLowerCase().includes(this.filtros.estado.toLowerCase()) &&
      item.observacion.toLowerCase().includes(this.filtros.observacion.toLowerCase())
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

  get resultadosPaginados(): ResultadoReporte[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.resultadosFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.resultadosFiltrados.length / this.tamanoPagina));
  }

  ordenar(campo: keyof ResultadoReporte): void {
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