import { NgModule } from '@angular/core';
import { CONTACTOS_COMPONENTES, ContactosAdd, Contactos, ContactosEdit, ContactosList, ContactosView } from './componente';
import { RouterModule, Routes } from '@angular/router';
import { InRoleCanActivate } from '../security';

export const routes: Routes = [
  { path: '', component: ContactosList },
  { path: 'add', component: ContactosAdd, canActivate: [ InRoleCanActivate('Administradores')] },
  { path: ':id/edit', component: ContactosEdit },
  { path: ':id', component: ContactosView },
  { path: ':id/:kk', component: ContactosView },
]
@NgModule({
  declarations: [],
  imports: [ Contactos, CONTACTOS_COMPONENTES, RouterModule.forChild(routes) ],
  exports: [ Contactos, RouterModule ]
})
export class ContactosModule { }
