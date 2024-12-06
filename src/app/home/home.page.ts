import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface Asistencia {
  nombre: string;
  fecha: string;
}

interface Clase {
  nombre: string;
  seccion: string;
  sala: string;
  profesor: string;
  mostrarAsistencia: boolean;
  asistencias: Asistencia[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  segment = 'Scan';
  qrText = '';
  scanResult = '';
  selectedClase: Clase | null = null;

  clases: Clase[] = [
    { nombre: 'ARQUITECTURA', seccion: 'ASY4131-012D', sala: 'L3', profesor: 'EMILIO GONZALO SOTO ROJAS', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'CALIDAD DE SOFTWARE', seccion: 'CSY4111-011D', sala: 'L5', profesor: 'PATRICIO ANDRES SOTO SERDIO', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'ESTADÍSTICA DESCRIPTIVA', seccion: 'MAT4140-012D', sala: 'L3', profesor: 'KATHERINE DEL CARMEN ENCINA ALARCON', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'INGLÉS INTERMEDIO', seccion: 'INI5111-019D', sala: '607', profesor: 'GUSTAVO ALEJANDRO ARIAS BECERRA', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'PROCESO DE PORTAFOLIO FINAL', seccion: 'PY41447-005D', sala: '806', profesor: 'PATRICIO ANDRES SOTO SERDIO', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'PROGRAMACIÓN DE APLICACIONES MÓVILES', seccion: 'PGY4121-012D', sala: 'L9', profesor: 'CARLOS FERNANDO MARTINEZ SANCHEZ', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'ÉTICA PARA EL TRABAJO', seccion: 'EAY4450-300D', sala: '503', profesor: 'ESTEBAN SALVATIERRA ROMAN', mostrarAsistencia: false, asistencias: [] },
  ];

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {}

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

  // Cambia el estado de mostrarAsistencia
  toggleAsistencia(clase: Clase) {
    this.selectedClase = this.selectedClase === clase ? null : clase; // Selecciona o deselecciona la clase
  }
  

  // Escanear QR y guardar asistencia
  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        LensFacing: LensFacing.Back,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.scanResult = data?.barcode?.displayValue;

      const asistencia: Asistencia = {
        nombre: this.scanResult, // Nombre obtenido del QR
        fecha: new Date().toLocaleString(),
      };

      this.clases[0].asistencias.push(asistencia); // Agregar la asistencia al primer curso
    }
  }
}
