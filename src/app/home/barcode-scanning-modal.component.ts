import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { ModalController } from '@ionic/angular';
import { AssignmentService } from '../services/assignment.service';


@Component({
  selector: 'app-barcode-scanning',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="tertiary">
        <ion-buttons slot="end">
          <ion-button (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div #square class="square"></div>
      <ion-fab *ngIf="isTorchAvailable" slot="fixed" horizontal="end" vertical="bottom">
        <ion-fab-button (click)="toggleTorch()">
          <ion-icon name="flashlight"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [
    `
      ion-content {
  --background: transparent;
  position: relative;
}
  .scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Fondo oscuro para dar foco al área del escáner */
  display: flex;
  justify-content: center;
  align-items: center;
}

      .square {
  position: relative;
  width: 300px;
  height: 300px;
  border: 6px solid #00bfff;
  border-radius: 16px;
  animation: pulse 1.5s infinite ease-in-out;
  background: transparent;
  box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3); /* Fondo que permite ver solo el área activa */
}

      @keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
    `,
  ],
})
export class BarcodeScanningModalComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() public formats: BarcodeFormat[] = [];
  @Input() public lensFacing: LensFacing = LensFacing.Back;
  @ViewChild('square') public squareElement: ElementRef<HTMLDivElement> | undefined;

  public isTorchAvailable = false;

  constructor(
    private readonly ngZone: NgZone,
    private modalController: ModalController,
    private assignmentService: AssignmentService
  ) {}

  public ngOnInit(): void {
    BarcodeScanner.isTorchAvailable().then((result) => {
      this.isTorchAvailable = result.available;
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.startScan();
    }, 250);
  }

  public ngOnDestroy(): void {
    this.stopScan();
  }

  public async closeModal(barcode?: Barcode): Promise<void> {
    this.modalController.dismiss({ barcode });
  }

  public async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
  }

  private async startScan(): Promise<void> {
    document.querySelector('body')?.classList.add('barcode-scanning-active');

    const options: StartScanOptions = {
      formats: this.formats,
      lensFacing: this.lensFacing,
    };

    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async (event) => {
        this.ngZone.run(() => {
          const barcodeData = event.barcode;
          const assignmentId = barcodeData.displayValue; // Suponemos que el QR contiene el ID de la asignatura

          // Agregar la asistencia a la asignatura
          this.assignmentService.registerAttendance(assignmentId, {
            asignatura: barcodeData.displayValue,
            fecha: new Date(),
          });

          // Cerrar modal después de registrar
          this.closeModal(barcodeData);
        });
      }
    );

    await BarcodeScanner.startScan(options);
  }

  private async stopScan(): Promise<void> {
    document.querySelector('body')?.classList.remove('barcode-scanning-active');
    await BarcodeScanner.stopScan();
  }
}
