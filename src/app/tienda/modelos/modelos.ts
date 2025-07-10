import { Injectable, Component, input, effect, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorMessagePipe, NotblankValidator } from '@my/library';
import { ViewModelPagedService } from '../../core';
import { FormButtons, Paginator } from '../../common-components';
import { ModelosDAOService } from '../daos-services';
import { NotificationType, WindowService } from 'src/app/common-services';

@Injectable({
  providedIn: 'root'
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ModelosViewModelService extends ViewModelPagedService<any, number> {
  constructor(dao: ModelosDAOService, private window: WindowService) {
    super(dao)
    this.rowsPerPage = 10
  }
  public override cancel(): void {
    this.clear()
    this.notify.clear()
    this.load()
  }

  public override delete(key: number, nextFn?: (hook?: boolean) => void): void {
    this.window.confirm('Una vez borrado no se podrá recuperar. ¿Continuo?',
      () => super.delete(key, nextFn), NotificationType.error, "Confirmación")
  }
}

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.html',
  styleUrls: ['./modelos.css'],
  standalone: true,
  imports: [Paginator, FormsModule, FormButtons, ErrorMessagePipe, NotblankValidator,],
})
export class Modelos implements OnDestroy {
  readonly page = input(0);

  constructor(protected VM: ModelosViewModelService) {
    effect(() => VM.load(this.page()))
  }

  ngOnDestroy(): void { this.VM.clear(); }
}

export const MODELOS_COMPONENTES = [Modelos,];
