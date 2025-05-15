import { Component, Input, Output, EventEmitter, SimpleChanges  } from '@angular/core';
import { BarcodeScannerComponent } from "../barcode-scanner/barcode-scanner.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-modal-scanner',
  imports: [BarcodeScannerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  templateUrl: './modal-scanner.component.html',
  styleUrl: './modal-scanner.component.css'
})
export class ModalScannerComponent {

  @Input() public openScanner: boolean = false;
  @Input() scannerAction: string = '';
  @Output() closeModal = new EventEmitter<void>();

  public isModalScanned: boolean = false;
  
  public closeModalScanner(): void {
    this.closeModal.emit();
    this.openScanner = false;
  }

  public openCheckWindows(): void {
        console.log('Modal status', this.scannerAction);
    this.closeModal.emit();
    this.openScanner = false;
    this.isModalScanned = true;

    setTimeout(() => {
      this.isModalScanned = false;
    }, 3000);
  }

}
