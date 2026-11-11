import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SesionAgenda {
  aprendiz: string;
  instructor: string;
  zona: string;
  fecha: string;
  hora: string;
  estado: string;
  accion: string;
}

@Component({
  selector: 'app-agenda',
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda {
  fechaMinima = this.obtenerFechaMinima();
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
  sesiones: SesionAgenda[] = [
    {
      aprendiz: 'Kendall Zeledón',
      instructor: 'Cristopher Durán',
      zona: 'Cartago',
      fecha: '12/08/2026',
      hora: '08:00',
      estado: 'Programada',
      accion: 'Modificar / Cancelar'
    },
    {
      aprendiz: 'José Guillén',
      instructor: 'María Rodríguez',
      zona: 'Tres Ríos',
      fecha: '13/08/2026',
      hora: '10:00',
      estado: 'Pendiente',
      accion: 'Modificar / Cancelar'
    }
  ];

  filtros = {
    aprendiz: '',
    instructor: '',
    zona: '',
    fecha: '',
    hora: '',
    estado: '',
    accion: ''
  };

  ordenCampo: keyof SesionAgenda | '' = '';
  ordenAscendente = true;

  paginaActual = 1;
  tamanoPagina = 5;

  get sesionesFiltradas(): SesionAgenda[] {
    let resultado = this.sesiones.filter(item =>
      item.aprendiz.toLowerCase().includes(this.filtros.aprendiz.toLowerCase()) &&
      item.instructor.toLowerCase().includes(this.filtros.instructor.toLowerCase()) &&
      item.zona.toLowerCase().includes(this.filtros.zona.toLowerCase()) &&
      item.fecha.toLowerCase().includes(this.filtros.fecha.toLowerCase()) &&
      item.hora.toLowerCase().includes(this.filtros.hora.toLowerCase()) &&
      item.estado.toLowerCase().includes(this.filtros.estado.toLowerCase()) &&
      item.accion.toLowerCase().includes(this.filtros.accion.toLowerCase())
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

  get sesionesPaginadas(): SesionAgenda[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.sesionesFiltradas.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.sesionesFiltradas.length / this.tamanoPagina));
  }

  ordenar(campo: keyof SesionAgenda): void {
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

  private obtenerFechaMinima(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }
}