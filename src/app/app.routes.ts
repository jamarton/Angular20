import { Routes, UrlSegment } from '@angular/router';
import { Home, PageNotFound } from './main-components';
import { AuthCanActivateFn, AuthWithRedirectCanActivate, LoginForm, RegisterUser } from './security';
import { Calculadora, Demos } from './ejemplos';
import { Modelos, Categorias } from './tienda';
import { PeliculasList, peliculasRoutes, actoresRoutes, Novedades } from './sakila';

export function svgFiles(url: UrlSegment[]) {
  return url.length === 1 && url[0].path.endsWith('.svg') ? ({consumed: url}) : null;
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home},
  { path: 'inicio', component: Home},
  { path: 'demos', component: Demos , canActivate: [AuthWithRedirectCanActivate('/login')]},
  { path: 'cacharro/de/hacer/numeros', component: Calculadora , title: 'Calculadora'},
  { path: 'contactos', loadChildren: () => import('./contactos/modulo').then(m => m.ContactosModule), title: 'Contactos'},

  { path: 'tienda/productos', loadChildren: () => import('./tienda/productos/modulo'), title: 'Productos'},
  // { path: 'productos', children: [
  //   { path: '', component: Productos},
  //   { path: 'add', component: Productos},
  //   { path: ':id/edit', component: Productos},
  //   { path: ':id', component: Productos},
  //   { path: ':id/:kk', component: Productos},
  // ]},
  { path: 'tienda/modelos', component: Modelos},
  { path: 'tienda/categorias', component: Categorias, canActivate: [AuthCanActivateFn]},
  { matcher: svgFiles, loadComponent: () => import('./ejemplos/grafico-svg/grafico-svg')},
  { path: 'config', loadChildren: () => import('./config/config'), title: 'Configuración', canActivateChild: [AuthCanActivateFn]},

  { path: 'sakila/novedades', pathMatch: 'full', component: Novedades, title: 'novedades' },
  { path: 'sakila/catalogo/categorias', component: PeliculasList, data: { search: 'categorias' }, title: 'categorias' },
  { path: 'sakila/catalogo/categorias/:idPeli/:tit', redirectTo: '/sakila/catalogo/:idPeli/:tit', title: 'catalogo' },
  { path: 'sakila/catalogo', pathMatch: 'full', children: peliculasRoutes, title: 'catalogo' },
  { path: 'sakila/actores/:id/:nom/:idPeli/:tit', redirectTo: '/sakila/catalogo/:idPeli/:tit', title: 'catalogo' },
  {
    path: 'sakila/actores', children: actoresRoutes, title: 'actores'
  },
  {
    path: 'sakila/categorias', loadChildren: () => import('./sakila/categorias/modulo.module'), title: 'categorias',
    // canActivate: [AuthWithRedirectCanActivate('/login'), InRoleCanActivate(environment.roleMantenimiento)]
  },
  {
    path: 'sakila/idiomas', loadChildren: () => import('./sakila/idiomas/modulo.module'), title: 'idiomas',
    // canActivate: [AuthWithRedirectCanActivate('/login'), InRoleCanActivate(environment.roleMantenimiento)]
  },

  { path: 'login', component: LoginForm },
  { path: 'registro', component: RegisterUser },

  { path: '404.html', component: PageNotFound },
  { path: '**', component: PageNotFound /*, redirectTo: '/inicio'*/ },
];
