import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Evaluaciones } from './evaluaciones';

describe('Evaluaciones', () => {
  let component: Evaluaciones;
  let fixture: ComponentFixture<Evaluaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Evaluaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(Evaluaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
