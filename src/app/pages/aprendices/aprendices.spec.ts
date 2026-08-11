import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aprendices } from './aprendices';

describe('Aprendices', () => {
  let component: Aprendices;
  let fixture: ComponentFixture<Aprendices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aprendices],
    }).compileComponents();

    fixture = TestBed.createComponent(Aprendices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
