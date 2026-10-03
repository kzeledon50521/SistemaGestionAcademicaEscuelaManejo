import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inscripciones } from './inscripciones';

describe('Inscripciones', () => {
  let component: Inscripciones;
  let fixture: ComponentFixture<Inscripciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inscripciones],
    }).compileComponents();

    fixture = TestBed.createComponent(Inscripciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
