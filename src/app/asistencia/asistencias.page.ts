import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  clase: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation(); // Obtener la navegación actual

    if (navigation?.extras?.state) {
      this.clase = navigation.extras.state['clase'];
      console.log('Clase:', this.clase);
    } else {
      console.error('El estado de navegación no está disponible');
    }
  }
}
