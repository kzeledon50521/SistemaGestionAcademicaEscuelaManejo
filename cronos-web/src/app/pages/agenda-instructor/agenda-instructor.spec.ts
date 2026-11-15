import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AgendaInstructor } from './agenda-instructor';

const api = 'https://localhost:7260/api/Agenda/agenda-instructor';
const sesion = {
  idSesion: 5, idAprendiz: 3, nombreAprendiz: 'Aprendiz de prueba', idInstructor: 11,
  nombreInstructor: 'Instructor de prueba', zona: 'Cartago', fecha: '2099-01-03',
  hora: '08:00:00', estado: 'Agendada'
};

describe('Agenda del instructor: vistas semanal y mensual', () => {
  let component: AgendaInstructor;
  let fixture: ComponentFixture<AgendaInstructor>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaInstructor],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(AgendaInstructor);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(r => r.url.endsWith('/api/Instructor')).flush([]);
    component.idInstructor = 11;
  });

  afterEach(() => http.verify());

  it('consulta la vista semanal con las sesiones de la semana', () => {
    component.consultar();
    const req = http.expectOne(r => r.url === api);
    expect(req.request.params.get('vista')).toBe('semana');
    req.flush({ vista: 'semana', desde: '2099-01-01', hasta: '2099-01-07', sesiones: [sesion] });
    expect(component.dias.length).toBe(1);
    expect(component.dias[0].sesiones[0].nombreAprendiz).toBe('Aprendiz de prueba');
  });

  it('consulta la vista mensual al cambiar de vista', () => {
    component.cambiarVista('mes');
    const req = http.expectOne(r => r.url === api);
    expect(req.request.params.get('vista')).toBe('mes');
    req.flush({ vista: 'mes', desde: '2099-01-01', hasta: '2099-01-31', sesiones: [sesion] });
    expect(component.dias.length).toBe(1);
  });

  it('informa cuando no hay sesiones asignadas', () => {
    component.consultar();
    http.expectOne(r => r.url === api)
      .flush({ vista: 'semana', desde: '2099-01-01', hasta: '2099-01-07', sesiones: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No tiene sesiones asignadas.');
  });
});
