import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage  {

  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async registrarUsuario() {
    if(this.username && this.email && this.password){
      if (this.password.length < 3 || this.password.length > 12) {
        await this.mostrarMensaje('La contraseña debe tener entre 3 y 12 caracteres.');
        return;
      }

      if (!this.validarEmail(this.email)){
        await this.mostrarMensaje('Por favor ingresa un correo electronico valido.')
      }
      const user = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      this.authService.saveUser(user); 

      const userType = this.email.endsWith('@profesor.cl') ? 'docente' : 'estudiante';
      await this.mostrarMensaje(`Registro exitoso como ${userType}. Ahora puedes iniciar sesión.`);
      this.router.navigate(['/welcome']);

      this.username = '';
      this.email = '';
      this.password = '';
    } else {
      await this.mostrarMensaje('Por favor completa todos los campos.');
    }
  }

  async verificarEmail() {
    if (!this.validarEmail(this.email)) {
      await this.mostrarMensaje('Por favor ingresa un correo electrónico válido.');
    }
  }

  validarEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  async mostrarMensaje(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Registro',
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  

}