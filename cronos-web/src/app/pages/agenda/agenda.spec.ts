import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Agenda } from './agenda';
import { HorarioDisponible } from '../../models/agenda.model';

// Datos sintéticos exclusivos de pruebas; nunca se cargan en la aplicación.
const api = 'https://localhost:7260/api/Agenda';
const instructor = { idInstructor: 11, nombreCompleto: 'Instructor de prueba' };
const horario: HorarioDisponible = {
  idHorario: 1, idInstructor: 11, nombreInstructor: instructor.nombreCompleto,
  zona: 'Cartago', fecha: '2099-01-03', hora: '08:00:00.0000000'
};

describe('Agenda: consulta de disponibilidad', () => {
  let component: Agenda;
  let fixture: ComponentFixture<Agenda>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agenda],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(Agenda);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${api}/zonas`).flush([
      { idZona: 1, nombre: 'Cartago' }, { idZona: 2, nombre: 'San José' }, { idZona: 3, nombre: 'Heredia' }
    ]);
    http.expectOne('https://localhost:7260/api/Aprendiz').flush([]);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  function seleccionar(zona = 'Cartago'): void {
    component.zona = zona;
    component.cambiarZona();
    const solicitud = http.expectOne(req => req.url === `${api}/instructores` && req.params.get('zona') === zona);
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush([instructor]);
    component.seleccionarInstructor(instructor);
  }

  it('carga las zonas reales de la API y conserva la fecha mínima', () => {
    const opciones = Array.from(fixture.nativeElement.querySelectorAll('select:first-of-type option')) as HTMLOptionElement[];
    expect(opciones.map(item => item.value)).toEqual(expect.arrayContaining(['Cartago', 'San José', 'Heredia']));
    expect(fixture.nativeElement.querySelector('input[type="date"]').min).toBe(component.fechaMinima);
    expect(component.horarios).toEqual([]);
    expect(component.aprendices).toEqual([]);
  });

  for (const zona of ['Cartago', 'San José', 'Heredia']) {
    it(`consulta ${zona} con el instructor seleccionado sin exigir aprendiz`, async () => {
      seleccionar(zona);
      component.fecha = '2099-01-03';
      component.consultarHorarios();
      const solicitud = http.expectOne(req => req.url === `${api}/horarios`);
      expect(solicitud.request.method).toBe('GET');
      expect(solicitud.request.params.get('zona')).toBe(zona);
      expect(solicitud.request.params.get('idInstructor')).toBe('11');
      expect(solicitud.request.params.get('fecha')).toBe('2099-01-03');
      expect(solicitud.request.params.has('idAprendiz')).toBe(false);
      solicitud.flush([{ ...horario, zona }]);
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('tbody').textContent).toContain(instructor.nombreCompleto);
      expect(component.horarios[0].zona).toBe(zona);
    });
  }

  it('permite omitir fecha sin inventar un rango de días', () => {
    seleccionar();
    component.consultarHorarios();
    const solicitud = http.expectOne(req => req.url === `${api}/horarios`);
    expect(solicitud.request.params.has('fecha')).toBe(false);
    solicitud.flush([]);
    expect(component.consultaRealizada).toBe(true);
    expect(component.mensaje).toContain('No hay horarios disponibles');
  });

  it('rechaza fechas pasadas sin enviar la consulta', () => {
    seleccionar();
    component.fecha = '2000-01-01';
    component.consultarHorarios();
    http.expectNone(req => req.url === `${api}/horarios`);
    expect(component.tipoMensaje).toBe('error');
    expect(component.mensaje).toContain('fechas anteriores');
  });

  it('exige zona e instructor seleccionado, no solo texto en el buscador', () => {
    component.consultarHorarios();
    expect(component.tipoMensaje).toBe('error');
    seleccionar();
    component.busquedaInstructor = 'otro texto';
    component.buscarInstructor();
    component.consultarHorarios();
    http.expectNone(req => req.url === `${api}/horarios`);
    expect(component.idInstructor).toBe(0);
  });

  it('conserva el buscador interno de instructores', async () => {
    seleccionar();
    component.instructores.push({ idInstructor: 12, nombreCompleto: 'Otra persona' });
    fixture.detectChanges();
    const entrada = fixture.nativeElement.querySelector('input[placeholder="Seleccione o busque un instructor"]') as HTMLInputElement;
    entrada.value = 'Otra';
    entrada.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(component.instructoresFiltrados.map(item => item.idInstructor)).toEqual([12]);
    expect(component.idInstructor).toBe(0);
    expect(fixture.nativeElement.querySelector('.searchable-options').textContent).toContain('Otra persona');
  });

  it('descarta horarios y selección al cambiar zona, incluso con respuestas atrasadas', () => {
    seleccionar();
    component.consultarHorarios();
    const anterior = http.expectOne(req => req.url === `${api}/horarios`);
    component.zona = 'Heredia';
    component.cambiarZona();
    expect(component.idInstructor).toBe(0);
    expect(component.busquedaInstructor).toBe('');
    expect(component.horarios).toEqual([]);
    http.expectOne(req => req.url === `${api}/instructores`).flush([]);
    anterior.flush([horario]);
    expect(component.horarios).toEqual([]);
    expect(component.consultaRealizada).toBe(false);
  });

  it('ignora una lista de instructores de la zona anterior', () => {
    component.zona = 'Cartago';
    component.cambiarZona();
    const anterior = http.expectOne(req => req.url === `${api}/instructores`);
    component.zona = 'Heredia';
    component.cambiarZona();
    http.expectOne(req => req.url === `${api}/instructores`).flush([]);
    anterior.flush([instructor]);
    expect(component.instructores).toEqual([]);
    expect(component.cargandoInstructores).toBe(false);
  });

  it('descarta respuestas previas al cambiar la fecha', () => {
    seleccionar();
    component.consultarHorarios();
    const anterior = http.expectOne(req => req.url === `${api}/horarios`);
    component.fecha = '2099-01-04';
    component.invalidarConsulta();
    anterior.flush([horario]);
    expect(component.horarios).toEqual([]);
  });

  it('muestra errores de API y permite reintentar', () => {
    seleccionar();
    component.consultarHorarios();
    http.expectOne(req => req.url === `${api}/horarios`).flush(
      { mensaje: 'El instructor no está activo.' }, { status: 400, statusText: 'Bad Request' }
    );
    expect(component.tipoMensaje).toBe('error');
    expect(component.mensaje).toBe('El instructor no está activo.');
    expect(component.cargandoHorarios).toBe(false);
    component.consultarHorarios();
    http.expectOne(req => req.url === `${api}/horarios`).flush([horario]);
    expect(component.horarios).toEqual([horario]);
    expect(component.tipoMensaje).toBe('');
  });

  it('conserva filtros, ordenamiento y paginación del grid', () => {
    component.horarios = Array.from({ length: 7 }, (_, i) => ({
      ...horario, idHorario: i + 1, hora: `${String(i + 8).padStart(2, '0')}:00`
    }));
    expect(component.horariosPaginados.length).toBe(5);
    component.paginaSiguiente();
    expect(component.horariosPaginados.length).toBe(2);
    component.ordenar('hora');
    component.ordenar('hora');
    expect(component.paginaActual).toBe(1);
    expect(component.horariosPaginados[0].hora).toBe('14:00');
    component.filtros.hora = '10:';
    expect(component.horariosFiltrados.length).toBe(1);
    expect(component.totalPaginas).toBe(1);
  });

  it('limpiar cancela lógicamente las consultas pendientes y reinicia filtros', () => {
    seleccionar();
    component.consultarHorarios();
    const pendiente = http.expectOne(req => req.url === `${api}/horarios`);
    component.filtros.zona = 'Cartago';
    component.limpiar();
    pendiente.flush([horario]);
    expect(component.zona).toBe('');
    expect(component.idInstructor).toBe(0);
    expect(component.horarios).toEqual([]);
    expect(component.filtros.zona).toBe('');
    expect(component.cargandoHorarios).toBe(false);
  });
});
