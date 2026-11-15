import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MisSesiones } from './mis-sesiones';
import { Sesion } from '../../models/agenda.model';

const api = 'https://localhost:7260/api/Agenda';
const sesion: Sesion = {
  idSesion: 5, idAprendiz: 3, nombreAprendiz: 'Aprendiz de prueba', idInstructor: 11,
  nombreInstructor: 'Instructor de prueba', zona: 'Cartago', fecha: '2099-01-03',
  hora: '08:00:00', estado: 'Agendada'
};

describe('Mis sesiones: cancelación', () => {
  let component: MisSesiones;
  let fixture: ComponentFixture<MisSesiones>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisSesiones],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(MisSesiones);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('https://localhost:7260/api/Aprendiz').flush([]);
    component.idAprendiz = 3;
    component.cambiarAprendiz();
    http.expectOne(r => r.url === `${api}/sesiones` && r.params.get('idAprendiz') === '3').flush([sesion]);
  });

  afterEach(() => http.verify());

  it('cancela la sesión y deja de mostrarla en la agenda', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.cancelar(sesion);
    const cancelacion = http.expectOne(r => r.url === `${api}/cancelar`);
    expect(cancelacion.request.method).toBe('POST');
    expect(cancelacion.request.params.get('idSesion')).toBe('5');
    cancelacion.flush({ mensaje: 'Sesión cancelada correctamente.' });
    http.expectOne(r => r.url === `${api}/sesiones`).flush([]);
    expect(component.sesiones.length).toBe(0);
    expect(component.tipoMensaje).toBe('exito');
  });

  it('muestra el rechazo cuando la sesión está dentro del período de restricción', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.cancelar(sesion);
    http.expectOne(r => r.url === `${api}/cancelar`)
      .flush({ mensaje: 'No se puede cancelar la sesión.' }, { status: 400, statusText: 'Bad Request' });
    expect(component.tipoMensaje).toBe('error');
    expect(component.mensaje).toBe('No se puede cancelar la sesión.');
    expect(component.sesiones.length).toBe(1);
  });

  it('no cancela si el usuario no confirma', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.cancelar(sesion);
    http.expectNone(r => r.url === `${api}/cancelar`);
  });
});
