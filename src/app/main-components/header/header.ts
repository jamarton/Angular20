import { Component, OnDestroy, signal } from '@angular/core';
import { Login } from "../../security/login/login";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, LOGIN_EVENT, LOGOUT_EVENT } from 'src/app/security';
import { environment } from 'src/environments/environment';
import { EventBusService } from 'src/app/common-services';
import { Subscription } from 'rxjs';

export interface Option {
  texto: string
  icono: string
  path?: string
  children?: Child[]
  visible: boolean
}
export interface Child {
  texto: string
  icono: string
  path: string
  separado?: boolean
  visible: boolean
}

@Component({
  selector: 'app-header',
  imports: [Login, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnDestroy {
  private login$: Subscription;

  menu = signal<Option[]>([])

  readonly roleMantenimiento = environment.roleMantenimiento
  constructor(public auth: AuthService, private eventBus: EventBusService) {
    this.login$ = this.eventBus.on(LOGIN_EVENT, () => {
      this.actualizaMenu()
    })
    this.login$.add(this.eventBus.on(LOGOUT_EVENT, () => {
      this.actualizaMenu()
    }))
    this.actualizaMenu()
  }
  ngOnDestroy(): void {
    this.login$.unsubscribe();
  }
  actualizaMenu() {
    this.menu.set([
      { texto: 'Inicio', icono: 'fa-solid fa-house', path: '/inicio', visible: true },
      { texto: 'Demos', icono: 'fa-solid fa-chalkboard-user', path: '/demos', visible: true },
      { texto: 'Calculadora', icono: 'fa-solid fa-calculator', path: '/cacharro/de/hacer/numeros', visible: true },
      { texto: 'Contactos', icono: 'fa-solid fa-address-book', path: '/contactos', visible: true },
      { texto: 'Tienda', icono: 'fa-solid fa-shop', children: [
        { texto: 'Productos', icono: 'fa-solid fa-gifts', path: '/tienda/productos', visible: this.auth.isInRoles(this.roleMantenimiento) },
        { texto: 'Categorias', icono: 'fa-solid fa-tags', path: '/tienda/categorias', separado: true, visible: true },
        { texto: 'Modelos', icono: 'fa-solid fa-shirt', path: '/tienda/modelos', visible: true },
      ], visible: this.auth.isInRoles(this.roleMantenimiento) },
      { texto: 'Sakila', icono: 'fa-solid fa-tv', path: '/sakila', children: [
        // { texto: 'Novedades', icono: 'fa-solid fa-calendar-plus', path: '/sakila', visible: true },
        { texto: 'Catalogo', icono: 'fa-solid fa-film', path: '/sakila/catalogo', visible: true },
        { texto: 'Categorias', icono: 'fa-solid fa-list', path: this.auth.isInRoles(this.roleMantenimiento) ? '/sakila/categorias' : '/sakila/catalogo/categorias', visible: true },
        { texto: 'Actores', icono: 'fa-solid fa-person-rays', path: '/sakila/actores', visible: true },
        { texto: 'Idiomas', icono: 'fa-solid fa-language', path: '/sakila/idiomas', visible: this.auth.isAuthenticated },
      ], visible: true },
      { path: '/algo.svg', texto: 'Grafica', icono: 'fa-solid fa-image', visible: true },
      { texto: 'Config', icono: 'fa-solid fa-gears', path: '/config', visible: this.auth.isAuthenticated, children: [
        { texto: 'Perfil', icono: 'fa-solid fa-gear', path: '/config/perfil', visible: this.auth.isAuthenticated },
        { texto: 'Permisos', icono: 'fa-solid fa-gear', path: '/config/permisos', visible: this.auth.isAuthenticated },
      ]  },
      { texto: 'Error', icono: 'fa-solid fa-ban', path: '/falsa', visible: true},
    ])
  }
}
