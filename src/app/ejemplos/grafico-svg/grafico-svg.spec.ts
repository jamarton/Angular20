import { ComponentFixture, TestBed } from '@angular/core/testing';
import GraficoSvg from './grafico-svg';

describe('GraficoSvg', () => {
  let component: GraficoSvg;
  let fixture: ComponentFixture<GraficoSvg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GraficoSvg ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoSvg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('changeColor', () => {
    spyOn(Math, 'random').and.returnValues(0.1, 0.2, 0.3)
    component.changeColor()
    expect(component.fillColor).toBe('rgb(25, 51, 76)');
  });
});
