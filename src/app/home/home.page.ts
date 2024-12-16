import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { AssignmentService } from '../services/assignment.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  segment: string = '';  // Segmento para cambiar entre las vistas de escaneo y asistencias
  result: string | null = null; // Resultado del QR escaneado
  assignments: any[] = []; // Asignaciones (clases)

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private assignmentService: AssignmentService,
    private cdRef: ChangeDetectorRef // Inyección de ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarAsignaciones();  // Cargar las asignaciones desde el servicio
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }

  // Función para mostrar los horarios de la clase en un popup
  async mostrarHorario(clase: any) {
    const alert = await this.alertController.create({
      header: clase.nombre,
      subHeader: 'Días de Clases:',
      message: clase.horarios.join('  ;  '),
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  // Función para abrir el escaneo del QR
  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      componentProps: { formats: ['QR_CODE'] }
    });

    modal.onDidDismiss().then((data) => {
      const barcode = data.data?.barcode;
      if (barcode) {
      console.log('Se ha escaneado el QR correctamente.');
        this.processScanResult(barcode);
      } else {
        console.log('No se ha escaneado ningún código QR.');
      }
    });

    await modal.present();
  }

  // Método para procesar el escaneo del QR y registrar la asistencia
  private async processScanResult(qrData: string): Promise<void> {
    const qrParts = qrData.split('|');
    if (qrParts.length >= 3) {
      const [asignatura, seccion, sala] = qrParts;
      const clase = this.assignments.find(c => c.nombre === asignatura && c.seccion === seccion && c.sala === sala);

      if (clase) {
        const fechaActual = new Date().toLocaleString('es-CL', {
          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
        });

        // Crear el objeto de asistencia
        const asistencia = { 
          id: clase.id, 
          asignatura, 
          seccion, 
          sala, 
          fecha: fechaActual, 
          claseInfo: clase.nombre 
        };

        // Agregar la asistencia a la clase
        if (!clase.asistencia) {
          clase.asistencia = [];
        }
        clase.asistencia.push(asistencia);

        // Mostrar el mensaje de confirmación
        this.showToast(`Asistencia registrada para: ${asignatura} - Sección: ${seccion}, Fecha: ${fechaActual}`);

        // Actualizar el resultado en la vista para mostrar la asistencia escaneada
        this.result = `Asistencia registrada para: ${asignatura} - Sección: ${seccion}, Fecha: ${fechaActual}`;

        // Llamar a detectChanges para actualizar la vista
        this.cdRef.detectChanges();
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'El QR escaneado no corresponde a ninguna clase válida.',
          buttons: ['Cerrar']
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Formato de QR inválido.',
        buttons: ['Cerrar']
      });
      await alert.present();
    }
  }

  // Función para mostrar el mensaje de confirmación
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,  // Duración del mensaje en milisegundos (5 segundos)
      position: 'bottom'
    });
    toast.present();
  }

  // Cargar las asignaciones desde el servicio
  cargarAsignaciones() {
    this.assignments = this.assignmentService.getAssignments();
  }

  // Alternar la visibilidad de las asistencias de una clase
  toggleClase(clase: any) {
    clase.mostrarAsistencia = !clase.mostrarAsistencia;
  }

  // Navegar a la vista de asistencias con los datos escaneados
  mostrarAsistencia(clase: any) {
    this.router.navigate(['/asistencia'], { state: { clase: clase } });
  }
}
