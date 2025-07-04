/* eslint-disable @typescript-eslint/no-unused-vars */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PRODUCTOS_COMPONENTES, ProductosAdd, ProductosEdit, ProductosList, ProductosView } from './productos';
import { environment } from 'src/environments/environment';
import { AuthWithRedirectCanActivate, InRoleCanActivate } from '../../security';

export const routes: Routes = [
  { path: '', component: ProductosList },
  { path: 'add', component: ProductosAdd,
    // canActivate: [AuthWithRedirectCanActivate('/login'), InRoleCanActivate(environment.roleMantenimiento)]
  },
  { path: ':id/edit', component: ProductosEdit,
    // canActivate: [AuthWithRedirectCanActivate('/login'), InRoleCanActivate(environment.roleMantenimiento)]
  },
  { path: ':id', component: ProductosView },
  { path: ':id/:kk', component: ProductosView },
];

@NgModule({
  declarations: [],
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forChild(routes), PRODUCTOS_COMPONENTES,
  ]
})
export default class ProductosModule { }
