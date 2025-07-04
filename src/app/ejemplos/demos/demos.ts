// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, ComponentRef, createComponent, EnvironmentInjector, input, inputBinding, linkedSignal, output, outputBinding, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { CapitalizePipe, LoggerService, MyLibraryModule } from '@my/library';
import { NotificationService, WindowService } from 'src/app/common-services';
import { Card } from "../../common-components/card";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Calculadora } from "../calculadora/calculadora";

@Component({
  selector: 'app-confirm',
  standalone: true, // ¡Este es un componente standalone!
  imports: [CommonModule],
  template: `
<style>
  .fondo-sombreado {
    position: fixed;
    background-color: black;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
  }
</style>
<div class="fondo-sombreado"></div>
<div class="modal fade show" [style.display]="'block'" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-gradient text-white bg-danger">
        <h5 class="modal-title" id="exampleModalLabel">{{titulo()}}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
          (click)="confirmar()"></button>
      </div>
      <div class="modal-body bg-light bg-gradient p-0">
          <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </symbol>
          </svg>
              <div class="m-0 p-3 alert alert-danger d-flex align-items-center rounded-0"
                role="alert">
                <svg class="bi flex-shrink-0 me-2 text-danger" width="24" height="24" role="img" aria-label="Danger:">
                  <use xlink:href="#exclamation-triangle-fill" />
                </svg>
          <div>{{message()}}</div>
        </div>
      </div>
      <div class="modal-footer bg-light bg-gradient">
        <button type="button" class="btn btn-secondary" (click)="confirmar(true)">{{aceptarMsg()}}</button>
        <button type="button" class="btn btn-secondary" (click)="confirmar()">{{cancelarMsg()}}</button>
      </div>
    </div>
  </div>
</div>  `,
})
export class ConfirmComponent {
  titulo = input('Confirmación')
  message = input('¿Estas seguro')
  aceptarMsg = input('Si')
  cancelarMsg = input('No')
  confirma = output<boolean>();

  confirmar(respuesta = false) {
    this.confirma.emit(respuesta)
  }
}

@Component({
  selector: 'app-dynamic-hello',
  standalone: true, // ¡Este es un componente standalone!
  imports: [CommonModule],
  template: `
    <div style="border: 1px solid blue; padding: 10px; margin: 10px;">
      <h3>Hola, {{ name() }}!</h3>
      <p>{{ message() }}</p>
      <button (click)="sayGoodbye()">Decir Adiós</button>
    </div>
  `,
})
export class DynamicHelloComponent {
  name = input('Mundo')
  message = input('Soy un componente dinámico.')
  goodbye = output<string>();

  sayGoodbye() {
    this.goodbye.emit(`Adiós desde ${this.name}!`);
  }
}
@Component({
  imports: [Card, CommonModule, FormsModule, CapitalizePipe, Calculadora, MyLibraryModule],
  templateUrl: './demos.html',
  styleUrl: './demos.css'
})
export class Demos {
  public readonly listado = signal([
    { id: 1, nombre: 'Madrid' },
    { id: 2, nombre: 'OVIEDO' },
    { id: 3, nombre: 'barcelona' },
    { id: 4, nombre: 'ciudad Real' },
  ])
  //public readonly idProvincia = linkedSignal<number>(() => this.listado()[0].id)
  public readonly idProvincia = linkedSignal<number>(() => this.listado()[0].id)
  public readonly index = linkedSignal<number, number>({
    source: this.idProvincia,
    computation: (newValue, _previousValue) => this.listado().findIndex(item => item.id == newValue),
    equal: (a, b) => a === b
  })
  public readonly valCalculadora = signal(22)

  constructor(public vm: NotificationService, public out: LoggerService,
    private environmentInjector: EnvironmentInjector, private viewContainerRef: ViewContainerRef,
    public window: WindowService) {
    // out.error('Es un error')
    // out.warn('Es un warn')
    // out.info('Es un info')
    // out.log('Es un log')
  }

  add(provincia: string) {
    const id = this.listado()[this.listado().length - 1].id + 1;
    this.listado.update(valor => [...valor, { id, nombre: provincia }]);
    this.idProvincia.set(id);
  }

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  private dynamicComponentContainer!: ViewContainerRef;
  componentRef: ComponentRef<DynamicHelloComponent> | null = null;

  createMyComponent() {
    this.window.confirm('Una vez borrado no se podrá recuperar. ¿Continuo?',
      () => alert('Sigo sin esperar')
    )
    // const confirm = this.viewContainerRef.createComponent(ConfirmComponent, {
    //   index: 0,
    //   bindings: [
    //     inputBinding('titulo', () => 'Borrado'),
    //     inputBinding('aceptarMsg', () => 'aceptar'),
    //     inputBinding('cancelarMsg', () => 'cancelar'),
    //     inputBinding('message', () => 'Una vez borrado no se podrá recuperar. ¿Continuo?'),
    //     outputBinding('confirma', (result: boolean) => {
    //       console.log(`resultado recibido: ${result}`);
    //       alert(result ? 'acepta' : 'cancela');
    //       confirm.destroy(); // Destruir después del cerrar
    //     })
    //   ]
    // });
    // console.error('Sigo sin esperar')
  }
  createMyComponen_old() {
    this.componentRef = this.viewContainerRef.createComponent(DynamicHelloComponent, {
      index: 0,
      bindings: [
        inputBinding('name', () => 'Usuario VIP'),
        inputBinding('message', () => '¡Bienvenido a la aplicación dinámica!'),
        outputBinding('goodbye', (msg: string) => {
          console.log(`Evento 'goodbye' recibido: ${msg}`);
          alert(msg);
          this.destroyMyComponent(); // Destruir después del adiós
        })
      ]
    });
    // if (this.componentRef) {
    //   this.destroyMyComponent();
    // }
    // this.dynamicComponentContainer.clear();
    // this.componentRef = this.dynamicComponentContainer.createComponent(DynamicHelloComponent, {
    //   bindings: [
    //     inputBinding('name', () => 'Usuario VIP'),
    //     inputBinding('message', () => '¡Bienvenido a la aplicación dinámica!'),
    //     outputBinding('goodbye', (msg: string) => {
    //       console.log(`Evento 'goodbye' recibido: ${msg}`);
    //       alert(msg);
    //       this.destroyMyComponent(); // Destruir después del adiós
    //     })
    //   ]});
    // this.componentRef = createComponent(DynamicHelloComponent, {
    //   environmentInjector: this.environmentInjector,
    //   bindings: [
    //     inputBinding('name', () => 'Usuario VIP'),
    //     inputBinding('message', () => '¡Bienvenido a la aplicación dinámica!'),
    //     outputBinding('', (msg: string) => {
    //       console.log(`Evento 'goodbye' recibido: ${msg}`);
    //       alert(msg);
    //       this.destroyMyComponent(); // Destruir después del adiós
    //     })
    //   ]
    // });
    // Opcional: Ejecutar detección de cambios si las propiedades se establecen después de la creación
    // Aunque Angular suele ser lo suficientemente inteligente, a veces es necesario.
    // this.componentRef.changeDetectorRef.detectChanges();
  }

  destroyMyComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
      console.log('Componente dinámico destruido.');
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    // Asegurarse de destruir el componente si el componente padre se destruye
    this.destroyMyComponent();
  }

}
