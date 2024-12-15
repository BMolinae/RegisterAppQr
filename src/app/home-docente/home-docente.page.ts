import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LoadingController, Platform } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home-docente.page.html',
  styleUrls: ['home-docente.page.scss'],
})
export class HomeDocentePage implements OnInit {
  segment = 'Generate';
  qrText = ''; // Texto que se genera para el QR
  clases = [
    { nombre: 'ARQUITECTURA', seccion: 'ASY4131-012D', sala: 'L3', profesor: 'EMILIO GONZALO SOTO ROJAS', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'CALIDAD DE SOFTWARE', seccion: 'CSY4111-011D', sala: 'L5', profesor: 'PATRICIO ANDRES SOTO SERDIO', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'ESTADÍSTICA DESCRIPTIVA', seccion: 'MAT4140-012D', sala: 'L3', profesor: 'KATHERINE DEL CARMEN ENCINA ALARCON', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'INGLÉS INTERMEDIO', seccion: 'INI5111-019D', sala: '607', profesor: 'GUSTAVO ALEJANDRO ARIAS BECERRA', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'PROCESO DE PORTAFOLIO FINAL', seccion: 'PY41447-005D', sala: '806', profesor: 'PATRICIO ANDRES SOTO SERDIO', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'PROGRAMACIÓN DE APLICACIONES MÓVILES', seccion: 'PGY4121-012D', sala: 'L9', profesor: 'CARLOS FERNANDO MARTINEZ SANCHEZ', mostrarAsistencia: false, asistencias: [] },
    { nombre: 'ÉTICA PARA EL TRABAJO', seccion: 'EAY4450-300D', sala: '503', profesor: 'ESTEBAN SALVATIERRA ROMAN', mostrarAsistencia: false, asistencias: [] },
  ];

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
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
    this.router.navigate(['/welcome']);
  }

 onClassChange(event: any) {
  const claseSeleccionada = event.detail.value;
  
  if (!claseSeleccionada) {
    this.qrText = ''; // No generar un QR vacío
  } else {
    const fecha = new Date().toISOString(); // Fecha actual
    this.qrText = JSON.stringify({
      idClase: claseSeleccionada.seccion, // ID único de la clase
      nombreClase: claseSeleccionada.nombre,
      sala: claseSeleccionada.sala,
      profesor: claseSeleccionada.profesor,
      fecha,
    });
  }
}

  captureScreen() {
    const elemnt = document.getElementById('qrImage') as HTMLElement;

    html2canvas(elemnt).then((canvas: HTMLCanvasElement) => {
      this.downloadImage(canvas);
      if (this.platform.is('capacitor')) this.ShareImage(canvas);
      else this.downloadImage(canvas);
    });
  }

  // Métodos existentes para descarga y compartir
  downloadImage(canvas: HTMLCanvasElement) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'qr.png';
    link.click();
  }

  async ShareImage(canvas: HTMLCanvasElement) {
    const base64 = canvas.toDataURL();
    const path = 'qr.png';

    const loading = await this.loadingController.create({ spinner: 'crescent' });
    await loading.present();

    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,
    }).then(async (res) => {
      const uri = res.uri;

      await Share.share({ url: uri });

      await Filesystem.deleteFile({
        path,
        directory: Directory.Cache,
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
}



