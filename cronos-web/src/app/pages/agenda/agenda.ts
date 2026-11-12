import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, HostListener, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Aprendiz } from '../../models/aprendiz.model';
import { HorarioDisponible, InstructorAgenda, Zona } from '../../models/agenda.model';
import { AgendaService } from '../../services/agenda.service';
import { AprendizService } from '../../services/aprendiz.service';

@Component({
  selector: 'app-agenda',
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.scss',
})
export class Agenda implements OnInit {
  fechaMinima = this.obtenerFechaMinima();
  zonas: Zona[] = [];
  aprendices: Aprendiz[] = [];
  instructores: InstructorAgenda[] = [];
  horarios: HorarioDisponible[] = [];
  zona = '';
  fecha = '';
  idInstructor = 0;
  busquedaAprendiz = '';
  busquedaInstructor = '';
  mostrarAprendices = false;
  mostrarInstructores = false;
  cargandoInstructores = false;
  cargandoHorarios = false;
  consultaRealizada = false;
  mensaje = '';
  errorAprendices = '';
  tipoMensaje: 'exito' | 'error' | '' = '';
  filtros = { nombreInstructor: '', zona: '', fecha: '', hora: '' };
  ordenCampo: keyof typeof this.filtros | '' = '';
  ordenAscendente = true;
  paginaActual = 1;
  tamanoPagina = 5;
  private solicitudInstructores = 0;
  private solicitudHorarios = 0;

  constructor(
    private agendaService: AgendaService,
    private aprendizService: AprendizService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.agendaService.obtenerZonas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.zonas = respuesta;
        this.cdr.markForCheck();
      },
      error: () => this.mostrarError('No fue posible cargar las zonas. Intente nuevamente más tarde.')
    });
    this.aprendizService.obtenerAprendices().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        this.aprendices = respuesta;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorAprendices = 'No fue posible cargar los aprendices. Puede consultar horarios sin seleccionar uno.';
        this.cdr.markForCheck();
      }
    });
  }

  get aprendicesFiltrados(): Aprendiz[] {
    const texto = this.busquedaAprendiz.trim().toLowerCase();
    return this.aprendices.filter(item => item.nombreCompleto.toLowerCase().includes(texto));
  }

  get instructoresFiltrados(): InstructorAgenda[] {
    const texto = this.busquedaInstructor.trim().toLowerCase();
    return this.instructores.filter(item => item.nombreCompleto.toLowerCase().includes(texto));
  }

  seleccionarAprendiz(aprendiz: Aprendiz): void {
    this.busquedaAprendiz = aprendiz.nombreCompleto;
    this.mostrarAprendices = false;
  }

  cambiarZona(): void {
    const solicitud = ++this.solicitudInstructores;
    this.instructores = [];
    this.idInstructor = 0;
    this.busquedaInstructor = '';
    this.mostrarInstructores = false;
    this.invalidarConsulta();
    this.cargandoInstructores = !!this.zona;
    if (!this.zona) return;

    this.agendaService.obtenerInstructores(this.zona).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: respuesta => {
        if (solicitud !== this.solicitudInstructores) return;
        this.instructores = respuesta;
        this.cargandoInstructores = false;
        if (respuesta.length === 0) this.mensaje = 'No hay instructores activos para la zona seleccionada.';
        this.cdr.markForCheck();
      },
      error: error => {
        if (solicitud !== this.solicitudInstructores) return;
        this.cargandoInstructores = false;
        this.mostrarError(error.error?.mensaje ?? 'No fue posible cargar los instructores.');
      }
    });
  }

  buscarInstructor(): void {
    this.idInstructor = 0;
    this.mostrarInstructores = true;
    this.invalidarConsulta();
  }

  seleccionarInstructor(instructor: InstructorAgenda): void {
    this.idInstructor = instructor.idInstructor;
    this.busquedaInstructor = instructor.nombreCompleto;
    this.mostrarInstructores = false;
    this.invalidarConsulta();
  }

  invalidarConsulta(): void {
    ++this.solicitudHorarios;
    this.horarios = [];
    this.cargandoHorarios = false;
    this.consultaRealizada = false;
    this.paginaActual = 1;
    this.mensaje = '';
    this.tipoMensaje = '';
  }

  consultarHorarios(): void {
    this.invalidarConsulta();
    this.fechaMinima = this.obtenerFechaMinima();
    if (!this.zona || !this.idInstructor) {
      this.mostrarError('Debe seleccionar una zona y un instructor.');
      return;
    }
    if (this.fecha && this.fecha < this.fechaMinima) {
      this.mostrarError('No se pueden consultar fechas anteriores a hoy.');
      return;
    }

    const solicitud = this.solicitudHorarios;
    this.cargandoHorarios = true;
    this.agendaService.obtenerHorarios(this.zona, this.idInstructor, this.fecha)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: respuesta => {
          if (solicitud !== this.solicitudHorarios) return;
          this.horarios = respuesta;
          this.cargandoHorarios = false;
          this.consultaRealizada = true;
          if (respuesta.length === 0) this.mensaje = 'No hay horarios disponibles para la consulta realizada.';
          this.cdr.markForCheck();
        },
        error: error => {
          if (solicitud !== this.solicitudHorarios) return;
          this.cargandoHorarios = false;
          this.mostrarError(error.error?.mensaje ?? 'No fue posible consultar los horarios disponibles.');
        }
      });
  }

  @HostListener('document:click')
  cerrarSelectores(): void {
    this.mostrarAprendices = false;
    this.mostrarInstructores = false;
  }

  get horariosFiltrados(): HorarioDisponible[] {
    let resultado = this.horarios.filter(item =>
      item.nombreInstructor.toLowerCase().includes(this.filtros.nombreInstructor.toLowerCase()) &&
      item.zona.toLowerCase().includes(this.filtros.zona.toLowerCase()) &&
      item.fecha.includes(this.filtros.fecha) && item.hora.includes(this.filtros.hora)
    );
    if (this.ordenCampo) {
      const campo = this.ordenCampo;
      resultado = [...resultado].sort((a, b) => {
        const comparacion = a[campo].localeCompare(b[campo], 'es', { numeric: true, sensitivity: 'base' });
        return this.ordenAscendente ? comparacion : -comparacion;
      });
    }
    return resultado;
  }

  get horariosPaginados(): HorarioDisponible[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    return this.horariosFiltrados.slice(inicio, inicio + this.tamanoPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.horariosFiltrados.length / this.tamanoPagina));
  }

  ordenar(campo: keyof typeof this.filtros): void {
    this.ordenAscendente = this.ordenCampo === campo ? !this.ordenAscendente : true;
    this.ordenCampo = campo;
    this.paginaActual = 1;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  limpiar(): void {
    this.zona = '';
    this.fecha = '';
    this.busquedaAprendiz = '';
    this.mostrarAprendices = false;
    this.filtros = { nombreInstructor: '', zona: '', fecha: '', hora: '' };
    this.ordenCampo = '';
    this.ordenAscendente = true;
    this.cambiarZona();
  }

  private mostrarError(mensaje: string): void {
    this.mensaje = mensaje;
    this.tipoMensaje = 'error';
    this.cdr.markForCheck();
  }

  private obtenerFechaMinima(): string {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Costa_Rica', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const valor = (tipo: string) => partes.find(parte => parte.type === tipo)?.value ?? '';
    return `${valor('year')}-${valor('month')}-${valor('day')}`;
  }
}
