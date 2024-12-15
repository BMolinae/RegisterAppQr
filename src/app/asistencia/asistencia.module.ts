import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciasPageRoutingModule } from './asistencia-routing.module';

import { AsistenciaPage } from './asistencias.page'; // Corregir nombre


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciasPageRoutingModule
  ],
  declarations: [AsistenciaPage]
})
export class AsistenciasPageModule {}
