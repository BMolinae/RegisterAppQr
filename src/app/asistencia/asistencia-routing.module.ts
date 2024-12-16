import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsistenciaPage } from './asistencia.page'; // Corregir nombre

const routes: Routes = [
  {
    path: '',
    component: AsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistenciaPageRoutingModule {}
