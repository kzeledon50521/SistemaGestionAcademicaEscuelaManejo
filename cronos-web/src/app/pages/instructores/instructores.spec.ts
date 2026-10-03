import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Instructores } from './instructores';

describe('Instructores', () => {
  let component: Instructores;
  let fixture: ComponentFixture<Instructores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Instructores],
    }).compileComponents();

    fixture = TestBed.createComponent(Instructores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
