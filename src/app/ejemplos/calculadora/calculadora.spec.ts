import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ERROR_LEVEL, LoggerService } from '@my/library';

import { Calculadora } from './calculadora';
import { NotificationService, NotificationType } from 'src/app/common-services';

describe('Pruebas aisladas de la calculadora', () => {
  // let calc: Calculadora;
  // let log: LoggerService;
  // let notify: NotificationService;

  // beforeAll(() => {
  //   log = new LoggerService(0)
  //   notify = new NotificationService(log)
  // 	calc = new Calculadora(log, notify)
  // });

  let calc: Calculadora;
  let fixture: ComponentFixture<Calculadora>;
  let notify: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calculadora],
      providers: [NotificationService, LoggerService, { provide: ERROR_LEVEL, useValue: 0 }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Calculadora);
    calc = fixture.componentInstance;
    notify = TestBed.inject(NotificationService)
    spyOn(notify, 'add')
    fixture.detectChanges();
  });

  beforeEach(() => {
    calc.inicia();
  });

  describe('Método: inicia', () => {
    it('Inicializa la calculadora', () => {
      calc.inicia()
      expect(calc.Pantalla()).toBe('0')
      expect(calc.Resumen()).toBe('')
    })
  });

  describe('Método: ponDigito', () => {
    '0123456789'.split('').forEach(digito => {
      it(`ponDigito ${digito} como string`, () => {
        calc.ponDigito(digito)
        expect(calc.Pantalla()).toBe(digito)
      })
    });
    'a-,'.split('').forEach(digito => {
      it(`ponDigito ${digito} como error`, () => {
        calc.ponDigito(digito)
        expect(calc.Pantalla()).toBe('0')
      })
    });
    for (let digito = 0; digito <= 9; digito++) {
      it(`ponDigito ${digito} como number`, () => {
        calc.ponDigito(digito)
        expect(calc.Pantalla()).toBe(digito.toString())
      })
    }
    ['22', '-1'].forEach(digito => {
      it(`ponDigito ${digito} como error`, () => {
        calc.ponDigito(digito)
        expect(calc.Pantalla()).toBe('0')
      })
    });
    ['1234567890', '9876543210', '666'].forEach(caso => {
      it(`Secuencia ${caso}`, () => {
        caso.split('').forEach(digito => calc.ponDigito(digito));
        expect(calc.Pantalla()).toBe(caso)
      })
    });
  });

  describe('Método: ponOperando', () => {
    ['1234', '98765', '6.66', Number.POSITIVE_INFINITY].forEach(caso => {
      it(`Operando validos ${caso}`, () => {
        calc.ponOperando(caso)
        expect(calc.Pantalla()).toBe(caso.toString())
      })
    });
    ['$98765', '1234$', ''].forEach(caso => {
      it(`Operando inválido ${caso}`, () => {
        calc.ponOperando(caso.toString())
        expect(calc.Pantalla()).toBe('0')
      })
    });
  });

  describe('Método: ponComa', () => {
    it('Pone la coma', () => {
      calc.ponDigito(1)
      calc.ponComa()
      calc.ponDigito(2)
      expect(calc.Pantalla()).toBe('1.2')
    })

    it('Repite la coma', () => {
      calc.ponOperando('0.1')
      calc.ponComa()
      calc.ponDigito(2)
      expect(calc.Pantalla()).toBe('0.12')
    })

    it('Empieza por la coma', () => {
      calc.ponComa()
      calc.ponDigito(2)
      expect(calc.Pantalla()).toBe('0.2')
    })
  });

  describe('Método: borrar', () => {
    it('Borra positivo', () => {
      calc.ponOperando('321')
      expect(calc.Pantalla()).toBe('321')
      calc.borrar()
      expect(calc.Pantalla()).toBe('32')
      calc.borrar()
      expect(calc.Pantalla()).toBe('3')
      calc.borrar()
      expect(calc.Pantalla()).toBe('0')
    })

    it('Borra negativo', () => {
      calc.ponOperando('-123')
      expect(calc.Pantalla()).toBe('-123')
      calc.borrar()
      expect(calc.Pantalla()).toBe('-12')
      calc.borrar()
      expect(calc.Pantalla()).toBe('-1')
      calc.borrar()
      expect(calc.Pantalla()).toBe('0')
    })
  });

  describe('Método: cambiaSigno', () => {
    it('Cambia positivo', () => {
      calc.ponOperando('555')
      calc.cambiaSigno()
      expect(calc.Pantalla()).toBe('-555')
    })

    it('Cambia negativo', () => {
      calc.ponOperando('-7032.333')
      calc.cambiaSigno()
      expect(calc.Pantalla()).toBe('7032.333')
    })

    it('Cambia infinito', () => {
      calc.ponOperando(Number.POSITIVE_INFINITY)
      calc.cambiaSigno()
      expect(calc.Pantalla()).toBe('-Infinity')
      calc.ponOperando(Number.NEGATIVE_INFINITY)
      calc.cambiaSigno()
      expect(calc.Pantalla()).toBe('Infinity')
    })
  });

  describe('Método: calcula', () => {
    describe('Operadores desconocidos', function () {
      '%&$^a9:'.split('').forEach(operador => {
        it(`Operador ${operador} desconocido`, () => {
          calc.calcula(operador)
          expect(calc.Pantalla()).toBe('0')
        })
      });
    });

    describe('Calcula sumas', function () {
      [[22222, 22222, 44444], [-1, 2, 1], [2, -1, 1], [-1, -1, -2], [0, 0, 0],
      [0.1, 0.2, 0.3], [9.9, 1.3, 11.2]].forEach(caso => {
        it(`Suma: ${caso[0]} + ${caso[1]} = ${caso[2]}`, function () {
          calc.ponOperando(caso[0])
          calc.calcula('+')
          calc.ponOperando(caso[1])
          calc.calcula('=')
          expect(calc.Pantalla()).toBe(caso[2].toString())
        })
      });
    });

    describe('Calcula sustracciones', function () {
      [[22222, 33333, -11111], [-1, 2, -3], [0, 0, 0],
      [1, 0.9, 0.1]].forEach(caso => {
        it(`Resta: ${caso[0]} - ${caso[1]} = ${caso[2]}`, function () {
          calc.ponOperando(caso[0])
          calc.calcula('-')
          calc.ponOperando(caso[1])
          calc.calcula('=')
          expect(calc.Pantalla()).toBe(caso[2].toString())
        })
      });
    });

    describe('Calcula productos', function () {
      [[10, 5, 50], [1.5, 2, 3], [0, 0, 0], [2, 0, 0],
      ['Infinity', 0, 'NaN'], ['Infinity', 'NaN', 'Infinity'], ['Infinity', '-Infinity', '-Infinity'],].forEach(caso => {
        it(`Multiplica: ${caso[0]} * ${caso[1]} = ${caso[2]}`, function () {
          calc.ponOperando(caso[0])
          calc.calcula('*')
          calc.ponOperando(caso[1])
          calc.calcula('=')
          expect(calc.Pantalla()).toBe(caso[2].toString())
        })
      });
    });

    describe('Calcula divisiones', function () {
      [[10, 5, 2], [1, 3, 0.333333333333333], [0, 0, 'NaN'], [2, 0, 'Infinity'],
      ['Infinity', 'Infinity', 'NaN']].forEach(caso => {
        it(`Divide: ${caso[0]} / ${caso[1]} = ${caso[2]}`, function () {
          calc.ponOperando(caso[0])
          calc.calcula('/')
          calc.ponOperando(caso[1])
          calc.calcula('=')
          expect(calc.Pantalla()).toBe(caso[2].toString())
        })
      });
    });
    [
      [22, '+', 5, '-', 0.75, '*', 3, '/', 2, '=', 39.375],
      [10, '*', 0.5, '/', 0.2, '+', -5, '=', 20]
    ].forEach(secuencia => {
      it('Secuencia', () => {
        for (let i = 0; i < secuencia.length - 1; i++)
          if (i % 2)
            calc.calcula(secuencia[i].toString())
          else
            calc.ponOperando(secuencia[i])
        expect(calc.Pantalla()).toBe(secuencia[secuencia.length - 1].toString())
      });
    });
  });
});

describe('Calculadora', () => {
  let component: Calculadora;
  let fixture: ComponentFixture<Calculadora>;
  let notify: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calculadora],
      providers: [NotificationService, LoggerService, { provide: ERROR_LEVEL, useValue: 0 }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Calculadora);
    component = fixture.componentInstance;
    notify = TestBed.inject(NotificationService)
    spyOn(notify, 'add')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cálculos', () => {
    const pantalla: HTMLElement = fixture.debugElement.query(By.css('.Pantalla')).nativeElement;
    expect(pantalla.textContent?.trim()).toBe('0')
    component.ponOperando(123)
    expect(component.Pantalla()).toBe('123')
    fixture.detectChanges()
    expect(pantalla.textContent?.trim()).toBe('123')
    fixture.debugElement.query(By.css('[value="7"]')).triggerEventHandler('click', null);
    fixture.detectChanges()
    expect(pantalla.textContent?.trim()).toBe('1237')
    fixture.debugElement.query(By.css('[value="."]')).triggerEventHandler('click', null);
    fixture.debugElement.query(By.css('[value="."]')).triggerEventHandler('click', null);
    expect(notify.add).toHaveBeenCalled();
    expect(notify.add).toHaveBeenCalledWith('Ya está la coma', NotificationType.warn)
  });

  describe('Eventos de teclado', () => {
    it('teclado', () => {
      spyOn(console, 'log').and.stub()
      // const pantalla: HTMLElement = fixture.debugElement.query(By.css('.Pantalla')).nativeElement;
      // const contenedor = fixture.debugElement.query(By.css('.Calculadora'));
      const contenedor = fixture.debugElement;
      contenedor.triggerEventHandler('keydown', { key: '9' });
      fixture.detectChanges()
      expect(component.Pantalla()).toBe('9')
      contenedor.triggerEventHandler('keydown', { key: '.' });
      fixture.detectChanges()
      expect(component.Pantalla()).toBe('9.')
      contenedor.triggerEventHandler('keydown', { key: 'backspace' });
      fixture.detectChanges()
      expect(component.Pantalla()).toBe('9')
      contenedor.triggerEventHandler('keydown', { key: 'c' });
      fixture.detectChanges()
      expect(component.Pantalla()).toBe('0')
    });

  })

});
