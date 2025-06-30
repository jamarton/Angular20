import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { Configuracion } from './configuracion';

describe('Configuracion', () => {
  let component: Configuracion;
  let fixture: ComponentFixture<Configuracion>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), Configuracion]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Configuracion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
