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

  get aprendicesFiltrados(): Aprendiz[] {
    const texto = this.busqueda.trim().toLowerCase();
    if (!texto) return this.aprendices;
    return this.aprendices.filter(item => item.nombreCompleto.toLowerCase().includes(texto) || item.cedula.toLowerCase().includes(texto));
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