import { Component, Input, Output, EventEmitter, SimpleChanges  } from '@angular/core';
import { BarcodeScannerComponent } from "../barcode-scanner/barcode-scanner.component";

@Component({
  selector: 'app-modal-scanner',
  imports: [BarcodeScannerComponent],
  templateUrl: './modal-scanner.component.html',
  styleUrl: './modal-scanner.component.css'
})
export class ModalScannerComponent {

  @Input() public openScanner: boolean = false;
  @Input() scannedCode: string = '';//Intentando traer los datos del escáner
  @Output() closeModal = new EventEmitter<void>();
  
  closeModalScanner(): void {
    this.closeModal.emit();
    this.openScanner = false;
  }

  //Intentando traer los datos del escáner
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scannedCode']) {
      console.log('ModalScannerComponent: Código escaneado:', this.scannedCode);
    }
  }
}
