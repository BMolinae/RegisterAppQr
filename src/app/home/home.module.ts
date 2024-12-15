import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { AssignmentService } from '../services/assignment.service';
import { HomePageRoutingModule } from './home-routing.module';
import { QrCodeModule } from 'ng-qrcode';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    QrCodeModule
  ],
  declarations: [HomePage, BarcodeScanningModalComponent],
  providers: [AssignmentService],  // Registra el servicio aquí
})
export class HomePageModule {}
