/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, forwardRef, input, Injectable } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, } from '@angular/common';
import { ErrorMessagePipe, TypeValidator } from '@my/library';
import { Subscription } from 'rxjs';
import { Paginator } from '../common-components/paginator';
import { HttpContext } from '@angular/common/http';
import { CancelOperationArg, RESTDAOService, ViewModelPagedService } from '../core';
import { AUTH_REQUIRED } from '../security';

export interface IContacto {
  [index: string]: any;
  id?: number
  tratamiento?: string
  // Tratamiento?: string
  nombre?: string
  apellidos?: string
  telefono?: string
  email?: string
  sexo?: string
  nacimiento?: string
  avatar?: string
  conflictivo?: boolean
  icono?: string
}

export class Contacto implements IContacto {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
  constructor(
    public id: number = 0,
    private _tratamiento?: string,
    public nombre?: string,
    public apellidos?: string,
    public telefono?: string,
    public email?: string,
    public sexo: string = 'H',
    public nacimiento?: string,
    public avatar?: string,
    public conflictivo: boolean = false,
  ) { }
  get tratamiento() { return this._tratamiento }
  set tratamiento(value: string | undefined) {
    if (this._tratamiento === value) return
    this._tratamiento = value
    if (!this._tratamiento) return
    this.sexo = this._tratamiento.endsWith('a.') ? 'M' : 'H'
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContactosDAOService extends RESTDAOService<Contacto, number> {
  constructor() {
    super('contactos', { context: new HttpContext().set(AUTH_REQUIRED, true) });
    this.pageQueryParam = '_page'
    this.rowsQueryParam = '_rows'
    this.sortQueryParam = '_sort'
  }
}
@Injectable({
  providedIn: 'root'
})
export class ContactosViewModelService extends ViewModelPagedService<Contacto, number> {
  constructor(dao: ContactosDAOService) {
    super(dao)
    this.rowsPerPage = 10
    this.orderBy = 'nombre,apellidos'
  }

  protected override afterAdd(): void {
      this.elemento = { id: 0, sexo: 'H'} as Contacto
  }

  protected override beforeDelete(cancel: CancelOperationArg): void {
      cancel.isCancel = !window.confirm('¿Seguro?')
  }

  override imageErrorHandler(event: Event, item: any) {
    (event.target as HTMLImageElement).src = item.sexo === 'H' ? '/images/user-not-found-male.png' : '/images/user-not-found-female.png'
  }
}

@Component({
    selector: 'app-contactos',
    templateUrl: './tmpl-anfitrion.html',
    styleUrls: ['./componente.css'],
    imports: [
        forwardRef(() => ContactosAdd),
        forwardRef(() => ContactosEdit),
        forwardRef(() => ContactosView),
        forwardRef(() => ContactosList),
    ]
})
export class Contactos implements OnInit, OnDestroy {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void {
    // this.vm.list();
    this.vm.load()
  }
  ngOnDestroy(): void { this.vm.clear(); }
}

/*
@Component({
  selector: 'app-contactos-list',
  templateUrl: './tmpl-list.sin-rutas.html',
  styleUrls: ['./componente.css'],
  standalone: true,
  imports: [NgIf, Paginator ]
})
export class ContactosList implements OnInit, OnDestroy {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void { }
  ngOnDestroy(): void { }
}
@Component({
  selector: 'app-contactos-add',
  templateUrl: './tmpl-form.html',
  styleUrls: ['./componente.css'],
  standalone: true,
  imports: [FormsModule, TypeValidator, ErrorMessagePipe]
})
export class ContactosAdd implements OnInit {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void { }
}
@Component({
  selector: 'app-contactos-edit',
  templateUrl: './tmpl-form.html',
  styleUrls: ['./componente.css'],
  standalone: true,
  imports: [FormsModule, TypeValidator, ErrorMessagePipe]
})
export class ContactosEdit implements OnInit, OnDestroy {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void { }
  ngOnDestroy(): void { }
}
@Component({
  selector: 'app-contactos-view',
  templateUrl: './tmpl-view.html',
  styleUrls: ['./componente.css'],
  standalone: true,
  imports: [DatePipe]
})
export class ContactosView implements OnInit, OnDestroy {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void { }
  ngOnDestroy(): void { }
}
*/

@Component({
    selector: 'app-contactos-list',
    templateUrl: './tmpl-list.con-rutas.html',
    styleUrls: ['./componente.css'],
    imports: [RouterLink, Paginator]
})
export class ContactosList implements OnChanges, OnDestroy {
  readonly page = input(0);

  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  // ngOnInit(): void {
  //   // this.vm.list();
  //   this.vm.load()
  // }
  ngOnChanges(_changes: SimpleChanges): void {
    this.vm.load(this.page())
  }
  ngOnDestroy(): void { this.vm.clear(); }
}
@Component({
    selector: 'app-contactos-add',
    templateUrl: './tmpl-form.html',
    styleUrls: ['./componente.css'],
    imports: [FormsModule, TypeValidator, ErrorMessagePipe]
})
export class ContactosAdd implements OnInit {
  constructor(protected vm: ContactosViewModelService) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void {
    this.vm.add();
  }
}
@Component({
    selector: 'app-contactos-edit',
    templateUrl: './tmpl-form.html',
    styleUrls: ['./componente.css'],
    imports: [FormsModule, TypeValidator, ErrorMessagePipe]
})
export class ContactosEdit implements OnInit, OnDestroy {
  private obs$?: Subscription;
  constructor(protected vm: ContactosViewModelService,
    protected route: ActivatedRoute, protected router: Router) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnInit(): void {
    this.obs$ = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = parseInt(params?.get('id') ?? '');
        if (id) {
          this.vm.edit(id);
        } else {
          this.router.navigate(['/404.html']);
        }
      });
  }
  ngOnDestroy(): void {
    this.obs$!.unsubscribe();
  }
}
@Component({
    selector: 'app-contactos-view',
    templateUrl: './tmpl-view.html',
    styleUrls: ['./componente.css'],
    imports: [DatePipe]
})
export class ContactosView implements OnChanges {
  readonly id = input<string>();
  constructor(protected vm: ContactosViewModelService, protected router: Router) { }
  public get VM(): ContactosViewModelService { return this.vm; }
  ngOnChanges(_changes: SimpleChanges): void {
    const id = this.id();
    if (id) {
      this.vm.view(+id);
    } else {
      this.router.navigate(['/404.html']);
    }
  }
}


export const CONTACTOS_COMPONENTES = [
  // Contactos,
  ContactosList, ContactosAdd, ContactosEdit, ContactosView,
];
