import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Clipboard } from '@capacitor/clipboard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Clase } from './clase.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  segment = 'Scan'
  qrText = ''
  scanResult = ''

  clasesEstudiante: Clase[] = [
    { nombre: 'ARQUITECTURA', seccion: 'ASY4131-012D', sala: 'L3', profesor: 'EMILIO GONZALO SOTO ROJAS', asistencias: [] },
    { nombre: 'CALIDAD DE SOFTWARE', seccion: 'CSY4111-011D', sala: 'L5', profesor: 'PATRICIO ANDRES SOTO SERDIO', asistencias: [] },
    { nombre: 'ESTADÍSTICA DESCRIPTIVA', seccion: 'MAT4140-012D', sala: 'L3', profesor: 'KATHERINE DEL CARMEN ENCINA ALARCON', asistencias: [] },
    { nombre: 'INGLÉS INTERMEDIO', seccion: 'INI5111-019D', sala: '607', profesor: 'GUSTAVO ALEJANDRO ARIAS BECERRA', asistencias: [] },
    { nombre: 'PROCESO DE PORTAFOLIO FINAL', seccion: 'PY41447-005D', sala: '806', profesor: 'PATRICIO ANDRES SOTO SERDIO', asistencias: [] },
    { nombre: 'PROGRAMACIÓN DE APLICACIONES MÓVILES', seccion: 'PGY4121-012D', sala: 'L9', profesor: 'CARLOS FERNANDO MARTINEZ SANCHEZ', asistencias: [] },
    { nombre: 'ÉTICA PARA EL TRABAJO', seccion: 'EAY4450-300D', sala: '503', profesor: 'ESTEBAN SALVATIERRA ROMAN', asistencias: [] },
  ];

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    if (this.platform.is('capacitor')) {

      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }

  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Scan QR y guardado en 'scanResult'
  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        LensFacing: LensFacing.Back
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      const qrContent = data?.barcode?.displayValue;
      this.scanResult = qrContent;

      const [nombreClase, seccion, sala, profesor] = qrContent?.split('|') || [];

      const clase = this.clasesEstudiante.find(c => c.nombre === nombreClase);

      if (clase) {
        clase.asistencias.push({
          fecha: new Date().toISOString(),
          seccion,
          sala,
          profesor,
        });
        console.log(`Asistencia registrada para ${nombreClase}`);
      } else {
        console.error('Clase no encontrada');
      }
    }
  }


  mostrarAsistencias(clase: any) {
    console.log(`Asistencias para ${clase.nombre}:`, clase.asistencias);
  }

  writeToClipboard = async () => {
    await Clipboard.write({
      string: this.scanResult
    });

    const toast = await this.toastController.create({
      message: 'Copited to clipboard',
      duration: 1000,
      color: 'tertiary',
      icon: 'clipboard-outline',
      position: 'middle'
    });
    toast.present();
  }
};


