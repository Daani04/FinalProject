import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BarcodeScannerComponent } from "../barcode-scanner/barcode-scanner.component";

@Component({
  selector: 'app-modal-scanner',
  imports: [BarcodeScannerComponent],
  templateUrl: './modal-scanner.component.html',
  styleUrl: './modal-scanner.component.css'
})
export class ModalScannerComponent {

  @Input() public openScanner: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  
  closeModalScanner(): void {
    this.closeModal.emit();
    this.openScanner = false;
  }
}
