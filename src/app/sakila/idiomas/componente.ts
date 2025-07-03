import { Injectable, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorMessagePipe, NotblankValidator } from '@my/library';
import { ViewModelService } from '../../core';
import { FormButtons } from '../../common-components';
import { IdiomasDAOService } from '../daos-services';

@Injectable({
  providedIn: 'root'
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class IdiomasViewModelService extends ViewModelService<any, number> {
  constructor(dao: IdiomasDAOService) {
    super(dao)
  }
  public override cancel(): void {
      this.clear()
      this.notify.clear()
      this.list()
  }
}

@Component({
  selector: 'app-idiomas',
  templateUrl: './tmpl-anfitrion.html',
  styleUrls: ['./componente.css'],
  standalone: true,
  imports: [FormsModule, FormButtons, ErrorMessagePipe, NotblankValidator,],
})
export class Idiomas implements OnInit {
  constructor(protected vm: IdiomasViewModelService) { }
  public get VM(): IdiomasViewModelService { return this.vm; }
  ngOnInit(): void {
    this.vm.list();
  }
}

export const IDIOMAS_COMPONENTES = [ Idiomas, ];
