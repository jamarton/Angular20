import { Component, Input, OnInit, OnChanges, SimpleChanges, HostListener, signal, input, effect, output, Signal } from '@angular/core';
import { LoggerService, ToComaDecimalPipe } from '@my/library';
import { environment } from 'src/environments/environment';
import { SlicePipe } from '@angular/common';
import { NotificationService, NotificationType } from 'src/app/common-services';

type SimboloDecimal = '.' | ',';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'calculadora',
    templateUrl: './calculadora.html',
    styleUrls: ['./calculadora.scss'],
    imports: [SlicePipe, ToComaDecimalPipe, ],
    host: { 'tabIndex': '0' }
})
export class Calculadora implements OnInit, OnChanges {
  public readonly Math = Math;

  private acumulado = 0;
  private operador = '+';
  private limpiar = true;
  private readonly miPantalla = signal('0')
  private readonly miResumen =  signal('');

  init = input<number>(0)
  // private initChange = effect(() => { if(this.init()) this.ponOperando(this.init().toString()); });

  constructor(private log: LoggerService, private notify: NotificationService) {
    this.inicia();
    effect(() => {
      if(this.init()) this.ponOperando(this.init().toString());
     })
  }

  get Pantalla(): Signal<string> { return this.miPantalla.asReadonly(); }
  // get Pantalla(): string { return this.miPantalla(); }
  // set pantalla(value: string) {
  //   if (!Number.isNaN(parseFloat(value)) || value === '-') {
  //     this.miPantalla.set(value);
  //   }
  // }
  get Resumen(): Signal<string> { return this.miResumen.asReadonly(); }

  readonly updated = output<number>();

  private separadorDecimal: SimboloDecimal = '.';
  get SeparadorDecimal() { return this.separadorDecimal; }
  @Input() set SeparadorDecimal(value: SimboloDecimal) {
    if (value !== this.separadorDecimal && (value === '.' || value === ',')) {
      this.separadorDecimal = value;
    } else if (value) {
      this.log.error('Separador decimal no reconocido.');
    }
  }

  inicia(): void {
    this.acumulado = 0;
    this.operador = '+';
    this.miPantalla.set('0');
    this.miResumen.set('');
    this.limpiar = true;
  }

  ponDigito(value: number | string): void {
    if (typeof (value) !== 'string')
      value = value.toString();
    if (value.length != 1 || value < '0' || value > '9') {
      this.log.error('No es un valor numérico.');
      return;
    }
    if (this.limpiar || this.miPantalla() == '0') {
      this.miPantalla.set(value);
      this.limpiar = false;
    } else
      this.miPantalla.update(old => old + value);
  }

  ponOperando(value: number | string): void {
    if (typeof value === "number" || (!Number.isNaN(parseFloat(value)) && parseFloat(value).toString() == value)) {
      this.miPantalla.set(value.toString());
      this.limpiar = false;
    } else {
      this.log.error('No es un valor numérico.');
    }
  }

  ponComa(): void {
    if (this.limpiar) {
      this.miPantalla.set('0.');
      this.limpiar = false;
    } else if (this.miPantalla().indexOf('.') === -1) {
      this.miPantalla.update(old => old + '.');
    } else {
      this.notify.add('Ya está la coma', NotificationType.warn)
      // this.log.warn('Ya está la coma');
    }
  }

  borrar(): void {
    if (this.limpiar || this.miPantalla().length == 1 || (this.miPantalla().length == 2 && this.miPantalla().startsWith('-'))) {
      this.miPantalla.set('0');
      this.limpiar = false;
    } else
      this.miPantalla.update(old => old.substring(0, old.length - 1));
  }

  cambiaSigno(): void {
    this.miPantalla.update(old => (-old).toString());
    if (this.limpiar) {
      this.acumulado = -this.acumulado;
    }
  }

  calcula(value: string): void {
    if ('+-*/='.indexOf(value) == -1) {
      this.log.error(`Operación no soportada: ${value}`);
      return;
    }

    const operando = parseFloat(this.miPantalla());
    switch (this.operador) {
      case '+':
        this.acumulado += operando;
        break;
      case '-':
        this.acumulado -= operando;
        break;
      case '*':
        this.acumulado *= operando;
        break;
      case '/':
        this.acumulado /= operando;
        break;
    }
    // Con eval()
    // acumulado = eval (acumulado + operador + miPantalla);
    // Number: double-precision IEEE 754 floating point.
    // 9.9 + 1.3, 0.1 + 0.2, 1.0 - 0.9
    this.miPantalla.set(parseFloat(this.acumulado.toPrecision(15)).toString());
    // this.miPantalla.set(this.acumulado.toString());
    this.miResumen.set(value == '=' ? '' : (`${this.miPantalla()} ${value}`));
    this.updated.emit(this.acumulado);
    this.operador = value;
    this.limpiar = true;
  }

  // @Input() init: string | number = '0';

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // if (this.init) {
    //   this.ponOperando(this.init);
    // }
  }
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnChanges(_changes: SimpleChanges): void {
    // if (this.init) {
    //   this.ponOperando(this.init.toString());
    // }
  }

  // import { fromEvent } from 'rxjs';
  // teclado = fromEvent(document, 'keydown').subscribe({next: ev => this.handleKeyDown(ev as KeyboardEvent)})
  // ngOnDestroy() {
  //   this.teclado.unsubscribe()
  // }

  @HostListener('keydown', ['$event'])
  handleKeyDown(ev: KeyboardEvent) {
    if ('0' <= ev.key && ev.key <= '9')
      this.ponDigito(ev.key)
    else if ('+-*/='.indexOf(ev.key) >= 0)
      this.calcula(ev.key)
    else
    switch (ev.key.toLowerCase()) {
      case '.': if (this.SeparadorDecimal === '.') this.ponComa();  break;
      case ',': if (this.SeparadorDecimal === ',') this.ponComa();  break;
      case 'backspace': this.borrar(); break;
      case 'c': this.inicia(); break;
    }
    if (!environment.production)  console.log(`Tecla: ${ev.key}`)
  }
}

