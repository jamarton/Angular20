/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, effect, Injectable, input, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NormalizePipe, ErrorMessagePipe, NotblankValidator, UppercaseValidator, TypeValidator } from '@my/library';
import { environment } from 'src/environments/environment';
import { ViewModelPagedService } from '../../core';
import { ProductosDAOService, ModelosDAOService, CategoriasDAOService } from '../daos-services';
import { FormButtons } from '../../common-components';
import { HttpParams } from '@angular/common/http';
import { Paginator } from "../../common-components/paginator";
import { NotificationType, WindowService } from 'src/app/common-services';

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})

@Injectable({
  providedIn: 'root'
})
export class ProductosViewModelService extends ViewModelPagedService<any, number> {
  constructor(dao: ProductosDAOService, private daoModelos : ModelosDAOService, private daoCategorias: CategoriasDAOService, private window: WindowService
  ) {
    super(dao)
    this.rowsPerPage = 14;
  }

  public override view(key: any): void {
    super.view(key, { params: new HttpParams().set('mode', 'detail') })
  }

  public override delete(key: number, nextFn?: (hook?: boolean) => void): void {
    this.window.confirm('Una vez borrado no se podrá recuperar. ¿Continuo?',
      () => super.delete(key, nextFn), NotificationType.error, "Confirmación")
  }

  modelos: any[] = []
  subcategorias: any[] = []

  protected override afterAdd(): void {
      this.cargaListas()
  }
  protected override afterEdit(): void {
      this.cargaListas()
  }

  cargaListas() {
    this.daoModelos.query().subscribe({
      next: data => this.modelos = data,
      error: err => this.handleError(err)
    })
    this.daoCategorias.subcategorias().subscribe({
      next: data => this.subcategorias = data,
      error: err => this.handleError(err)
    })
  }
}

@Component({
  selector: 'app-productos-list',
  templateUrl: './tmpl-list.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [RouterLink, CommonModule, NormalizePipe, Paginator]
})
export class ProductosList implements OnDestroy {
  readonly roleMantenimiento = environment.roleMantenimiento
  readonly page = input(0);

  constructor(protected vm: ProductosViewModelService) {
    effect(() => vm.load(this.page()))
  }

  public get VM(): ProductosViewModelService { return this.vm; }

  ngOnDestroy(): void { this.vm.clear(); }
}

@Component({
  selector: 'app-productos-add',
  templateUrl: './tmpl-form.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorMessagePipe, NotblankValidator, UppercaseValidator, TypeValidator, FormButtons]
})
export class ProductosAdd implements OnInit {
  constructor(protected vm: ProductosViewModelService) { }
  public get VM(): ProductosViewModelService { return this.vm; }
  ngOnInit(): void {
    this.vm.add();
  }
}

@Component({
  selector: 'app-productos-edit',
  templateUrl: './tmpl-form.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorMessagePipe, NotblankValidator, UppercaseValidator, TypeValidator, FormButtons]
})
export class ProductosEdit implements OnChanges {
  @Input() id?: string;
  constructor(protected vm: ProductosViewModelService, protected router: Router) { }
  public get VM(): ProductosViewModelService { return this.vm; }
  ngOnChanges(_changes: SimpleChanges): void {
    if (this.id) {
      this.vm.edit(+this.id);
    } else {
      this.router.navigate(['/404.html']);
    }
  }
}

@Component({
  selector: 'app-productos-view',
  templateUrl: './tmpl-view.html',
  styleUrls: ['./productos.css'],
  standalone: true,
  imports: [FormButtons, CommonModule]
})
export class ProductosView {
  constructor(protected vm: ProductosViewModelService, protected router: Router) { }
  public get VM(): ProductosViewModelService { return this.vm; }
  @Input() set id(key: string) {
    if (+key) {
      this.vm.view(+key);
    } else {
      this.router.navigate(['/404.html']);
    }
  }
}


export const PRODUCTOS_COMPONENTES = [ProductosList, ProductosAdd, ProductosEdit, ProductosView,];
