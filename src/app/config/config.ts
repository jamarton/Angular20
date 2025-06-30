import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuracion } from './configuracion/configuracion';
import { Permisos } from './permisos/permisos';
import { Routes, RouterModule } from '@angular/router';
import { Perfil } from './perfil/perfil';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: Configuracion },
  { path: 'perfil', component: Perfil },
  { path: 'permisos', component: Permisos },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes),
        Configuracion, Perfil, Permisos,
    ]
})
export default class ConfigModule { }
