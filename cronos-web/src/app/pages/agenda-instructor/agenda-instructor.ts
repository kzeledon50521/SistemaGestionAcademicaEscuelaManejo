import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AgendaInstructor as AgendaRespuesta, Sesion } from '../../models/agenda.model';
import { Instructor } from '../../models/instructor.model';
import { AgendaService } from '../../services/agenda.service';
import { InstructorService } from '../../services/instructor.service';

interface DiaAgenda {
  fecha: string;
  sesiones: Sesion[];
}

@Component({
  selector: 'app-agenda-instructor',
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-instructor.html',
  styleUrl: './agenda-instructor.scss',
})
export class AgendaInstructor implements OnInit {
  instructores: Instructor[] = [];
  idInstructor = 0;
  vista: 'semana' | 'mes' = 'semana';
  fechaReferencia = this.hoy();
  agenda: AgendaRespuesta | null = null;
  dias: DiaAgenda[] = [];
  cargando = false;
  mensaje = '';
  private solicitud = 0;

  constructor(
    private agendaService: AgendaService,
    private instructorService: InstructorService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.instructorService
      .obtenerInstructores()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (respuesta) => {
          this.instructores = respuesta;
          this.cdr.markForCheck();
        },
        error: () => {
          this.mensaje = 'No se pudo cargar la lista de instructores.';
          this.cdr.markForCheck();
        },
      });
  }

  cambiarVista(vista: 'semana' | 'mes'): void {
    this.vista = vista;
    this.consultar();
  }

  desplazar(direccion: -1 | 1): void {
    const [anio, mes, dia] = this.fechaReferencia.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    if (this.vista === 'semana') {
      fecha.setDate(fecha.getDate() + 7 * direccion);
    } else {
      fecha.setDate(1);
      fecha.setMonth(fecha.getMonth() + direccion);
    }
    this.fechaReferencia = this.formatear(fecha);
    this.consultar();
  }

  irAHoy(): void {
    this.fechaReferencia = this.hoy();
    this.consultar();
  }

  consultar(): void {
    const solicitud = ++this.solicitud;
    this.mensaje = '';
    this.agenda = null;
    this.dias = [];
    if (!this.idInstructor) return;

    this.cargando = true;
    this.agendaService
      .obtenerAgendaInstructor(this.idInstructor, this.vista, this.fechaReferencia)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (respuesta) => {
          if (solicitud !== this.solicitud) return;
          this.agenda = respuesta;
          this.dias = this.agrupar(respuesta.sesiones);
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          if (solicitud !== this.solicitud) return;
          this.cargando = false;
          this.mensaje = error.error?.mensaje ?? 'No se pudo consultar la agenda.';
          this.cdr.markForCheck();
        },
      });
  }

  private agrupar(sesiones: Sesion[]): DiaAgenda[] {
    const mapa = new Map<string, Sesion[]>();
    for (const sesion of sesiones) {
      mapa.set(sesion.fecha, [...(mapa.get(sesion.fecha) ?? []), sesion]);
    }
    return [...mapa.entries()].map(([fecha, items]) => ({ fecha, sesiones: items }));
  }

  private hoy(): string {
    const partes = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Costa_Rica',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    return partes;
  }

  private formatear(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}
