import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  username: string='';
  password: string='';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async iniciarSesion() {
    if (this.authService.validateCredentials(this.username, this.password)) {
      const userType = this.authService.getUserType();
  
      if (userType === 'docente') {
        await this.mostrarMensaje('Inicio de sesión exitoso como Docente.');
        this.router.navigate(['/home-docente']); 
      } else {
        await this.mostrarMensaje('Inicio de sesión exitoso como Estudiante.');
        this.router.navigate(['/home']); 
      }
    } else {
      await this.mostrarMensaje('Credenciales incorrectas, intente nuevamente.');
    }
    this.username = '';
    this.password = '';
  }
  

  async mostrarMensaje(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Inicio de Sesión',
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }
}