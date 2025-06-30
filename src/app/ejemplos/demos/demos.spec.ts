import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Demos } from './demos';
import { ERROR_LEVEL } from '@my/library';

describe('Demos', () => {
  let component: Demos;
  let fixture: ComponentFixture<Demos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: ERROR_LEVEL, useValue: 0 }],
      imports: [Demos]
    }).compileComponents();

    fixture = TestBed.createComponent(Demos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(console, 'log')
    expect(component).toBeTruthy();
  });
});
