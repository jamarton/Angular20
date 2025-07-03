import { Component, input, output, Signal, computed } from '@angular/core';

@Component({
  selector: 'app-paginator',
  template: `
      <nav aria-label="Page navigation">
          <ul class="pagination justify-content-end">
              <li class="page-item" [class.disabled]="actual() === 0">
                <input type="button" class="page-link" value="&laquo;" (click)="pageChange.emit(0)" >
              </li>
              @for (pag of paginas(); track pag) {
                @if(pag < 0) {
                  <li class="page-item disabled">
                    <input type="button" class="page-link" value="&hellip;" >
                  </li>
                } @else {
                  <li class="page-item" [class.active]="actual() === pag">
                    <input type="button" class="page-link" value="{{pag + 1}}" (click)="pageChange.emit(pag)" >
                  </li>
                }
              }
              <li class="page-item" [class.disabled]="actual() === ultima()">
                <input type="button" class="page-link" value="&raquo;" (click)="pageChange.emit(ultima()-1)" >
              </li>
          </ul>
      </nav>
  `,
  standalone: true,
  imports: []
})
export class Paginator {
  public actual = input.required<number>()
  public ultima = input.required<number>()
  // eslint-disable-next-line @angular-eslint/no-input-rename
  public numeroDePaginasVisibles = input<number>(20, { alias: 'max-visibles' })

  // eslint-disable-next-line @angular-eslint/no-output-rename
  public readonly pageChange = output<number>({ alias: 'page-change' })
  protected paginas: Signal<number[]> = computed(() => {
    const paginas: number[] = []
    let primeraPaginaVisible = 0;
    let ultimaPaginaVisible = this.ultima();
    if (ultimaPaginaVisible > this.numeroDePaginasVisibles()) {
      const mitadDelNumeroDePaginasVisibles = Math.floor(this.numeroDePaginasVisibles() / 2);
      primeraPaginaVisible = Math.max(0, this.actual() - mitadDelNumeroDePaginasVisibles + 1);
      ultimaPaginaVisible = Math.min(this.ultima(), this.actual() + mitadDelNumeroDePaginasVisibles);
      // Ajustar el rango si está cerca del principio o del final
      if (ultimaPaginaVisible - primeraPaginaVisible < this.numeroDePaginasVisibles()) {
        if (primeraPaginaVisible === 0) {
          ultimaPaginaVisible = Math.min(this.ultima(), primeraPaginaVisible + this.numeroDePaginasVisibles());
        } else if (ultimaPaginaVisible === this.ultima()) {
          primeraPaginaVisible = Math.max(1, this.ultima() - this.numeroDePaginasVisibles());
        }
      }
    }
    if (primeraPaginaVisible > 0) paginas.push(-1) // mostrar elipsis inicial
    for (let i = primeraPaginaVisible; i < ultimaPaginaVisible; paginas.push(i++));
    if (ultimaPaginaVisible < this.ultima()) paginas.push(-2) // mostrar elipsis final
    return paginas;
  })
}
