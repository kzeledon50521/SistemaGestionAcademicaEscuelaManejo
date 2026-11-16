import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Aprendiz } from '../../models/aprendiz.model';
import { Sesion } from '../../models/agenda.model';
import { AgendaService } from '../../services/agenda.service';
import { AprendizService } from '../../services/aprendiz.service';

@Component({
  selector: 'app-mis-sesiones',
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-sesiones.html',
  styleUrl: './mis-sesiones.scss',
})
export class MisSesiones implements OnInit {
  aprendices: Aprendiz[] = [];
  idAprendiz = 0;
  sesiones: Sesion[] = [];
  cargando = false;
  consultaRealizada = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';
  private solicitud = 0;

  constructor(
    private agendaService: AgendaService,
    private aprendizService: AprendizService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.aprendizService
      .obtenerAprendices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (respuesta) => {
          this.aprendices = respuesta;
          this.cdr.markForCheck();
        },
        error: () => this.mostrarMensaje('No se pudo cargar la lista de aprendices.', 'error'),
      });
  }

  cambiarAprendiz(): void {
    this.mensaje = '';
    this.tipoMensaje = '';
    this.cargarSesiones();
  }

  cancelar(sesion: Sesion): void {
    const detalle = `${sesion.fecha} ${sesion.hora.substring(0, 5)}`;
    if (!confirm(`¿Desea cancelar la sesión del ${detalle}?`)) return;

    this.agendaService
      .cancelarSesion(sesion.idSesion, this.idAprendiz)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (respuesta) => {
          this.mostrarMensaje(respuesta?.mensaje ?? 'Sesión cancelada correctamente.', 'exito');
          this.cargarSesiones();
        },
        error: (error) =>
          this.mostrarMensaje(error.error?.mensaje ?? 'No se pudo cancelar la sesión.', 'error'),
      });
  }

  private cargarSesiones(): void {
    const solicitud = ++this.solicitud;
    this.sesiones = [];
    this.consultaRealizada = false;
    if (!this.idAprendiz) return;

    this.cargando = true;
    this.agendaService
      .obtenerSesionesAprendiz(this.idAprendiz)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (respuesta) => {
          if (solicitud !== this.solicitud) return;
          this.sesiones = respuesta;
          this.cargando = false;
          this.consultaRealizada = true;
          this.cdr.markForCheck();
        },
        error: (error) => {
          if (solicitud !== this.solicitud) return;
          this.cargando = false;
          this.mostrarMensaje(error.error?.mensaje ?? 'No se pudieron consultar las sesiones.', 'error');
        },
      });
  }

  private mostrarMensaje(mensaje: string, tipo: 'exito' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
    this.cdr.markForCheck();
  }
}
