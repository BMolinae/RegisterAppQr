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

  segment = 'Generate'
  qrText = ''
  scanResult = 'benjyy'

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
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


  captureScreen() {

    const elemnt = document.getElementById('qrImage') as HTMLElement;

    html2canvas(elemnt).then((canvas: HTMLCanvasElement) => {

      this.downloadImage(canvas);
      if (this.platform.is('capacitor')) this.ShareImage(canvas);
      else this.downloadImage(canvas);

    })

  }

  //  Download image web 
  downloadImage(canvas: HTMLCanvasElement) {

    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'qr.png';
    link.click();

  }

  //  Share image mobile
  async ShareImage(canvas: HTMLCanvasElement) {

    let base64 = canvas.toDataURL();
    let path = 'qr.png';


    const loading = await this.loadingController.create({ spinner: 'crescent' });
    await loading.present();

    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,
    }).then(async (res) => {

      let uri = res.uri;

      await Share.share({ url: uri });

      await Filesystem.deleteFile({
        path,
        directory: Directory.Cache
      })
    }).finally(() => {
      loading.dismiss();
    })
  }


};


