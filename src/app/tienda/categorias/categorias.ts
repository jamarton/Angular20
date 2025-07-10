import { Component, effect, Injectable, OnInit, signal } from '@angular/core';
import { WindowService, NotificationType } from 'src/app/common-services';
import { CancelOperationArg, ViewModelService } from 'src/app/core';
import { CategoriasDAOService } from '../daos-services';
import { FormsModule } from '@angular/forms';
import { ErrorMessagePipe, NotblankValidator } from '@my/library';
import { FormButtons } from 'src/app/common-components';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class CategoriasViewModelService extends ViewModelService<any, number> {
  readonly id = signal<number | undefined>(undefined);

  constructor(dao: CategoriasDAOService, private window: WindowService) {
    super(dao)
    effect(() => {
      if (this.id())
        this.load(this.id() as number)
    })
  }

  public override cancel(): void {
    this.clear()
    this.notify.clear()
    this.list()
  }

  protected override afterList(): void {
      if (this.id() && this.listado.find(item => item.id === this.id()))
        this.load(this.id() as number)
      else if(this.listado.length)
        this.id.set(this.listado[0].id)
  }

  public override delete(key: number, nextFn?: (hook?: boolean) => void): void {
    this.window.confirm('Una vez borrado no se podrá recuperar. ¿Continuo?',
      () => super.delete(key, nextFn), NotificationType.error, "Confirmación")
  }

  protected override beforeSend(_cancel: CancelOperationArg): void {
      if(this.Elemento.parentid === "")
        this.Elemento.parentid = null
  }

  SubCategorias: any[] = []

  load(key: number) {
    (this.dao as CategoriasDAOService).querySubcategorias(key).subscribe({
      next: data => this.SubCategorias = data,
      error: err => this.handleError(err)
    })
  }
}

@Component({
  selector: 'app-categorias',
  providers: [CategoriasViewModelService],
  imports: [FormsModule, FormButtons, ErrorMessagePipe, NotblankValidator,],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {

  constructor(protected VM: CategoriasViewModelService) { }

  ngOnInit(): void {
    this.VM.list();
  }
}
