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
              <li class="page-item" [class.active]="actual() === pag">
                <input type="button" class="page-link" value="{{pag + 1}}" (click)="pageChange.emit(pag)" >
              </li>
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
  // eslint-disable-next-line @angular-eslint/no-output-rename
  public readonly pageChange = output<number>({alias: 'page-change'})
  protected paginas: Signal<number[]> = computed(() => {
    const paginas: number[] = []
    for(let i = 0; i < this.ultima(); paginas[i] = i++);
    return paginas;
  })
}
