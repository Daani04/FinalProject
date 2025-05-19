import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BarcodeScannerComponent } from "../barcode-scanner/barcode-scanner.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductAllData, Warehouse } from '../../models/response.interface';
import { RequestService } from '../../services/request.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

export type ModalState = 'closed' | 'scanner' | 'scanned' | 'selectWarehouse' | 'productInfo' | 'formData';

@Component({
  selector: 'app-modal-scanner',
  standalone: true,
  imports: [
    BarcodeScannerComponent, 
    ReactiveFormsModule, 
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './modal-scanner.component.html',
  styleUrl: './modal-scanner.component.css'
})
export class ModalScannerComponent implements OnInit {
  constructor(public service: RequestService, private http: HttpClient) { }

  @Input() openScanner: boolean = false;
  @Input() scannerAction: string = '';
  @Input() barcodeCheck: string = '';
  @Output() closeModal = new EventEmitter<void>();

  public isModalScanned: boolean = false;
  public noProductInBBDD: boolean = false;
  
  public closeModalScanner(): void {
    this.closeModal.emit();
    this.openScanner = false;
    this.warehouseID = 0;
    this.productForm.reset();
    this.productData = {
      name: '',
      brand: '',
      expirationDate: '',
      quantity: '',
      protein: '',
      nutriscore: '',
      ecoscore: '',
      imageUrl: ''
    };
  }

  private loadProductData() {
    this.productData = {
      name: localStorage.getItem('product_name') ?? '',
      brand: localStorage.getItem('product_brand') ?? '',
      expirationDate: localStorage.getItem('product_expiration_date') ?? '',
      quantity: localStorage.getItem('product_quantity') ?? '',
      protein: localStorage.getItem('product_protein') ?? '',
      nutriscore: localStorage.getItem('product_nutriscore') ?? '',
      ecoscore: localStorage.getItem('product_ecoscore') ?? '',
      imageUrl: localStorage.getItem('product_image_url') ?? ''
    };
  }

  // Public methods for UI interaction
  public closeModalScanner(): void {
    this.setModalState('closed');
  }

  public openCheckWindows(): void {
    console.log('Modal status', this.scannerAction);
    this.closeModal.emit();
    this.openScanner = false;
    this.isModalScanned = true;

    setTimeout(() => {
      this.isModalScanned = false;
      window.location.reload();
    }, 3000);
  }

  public handleProductNotFound(): void {
    this.closeModal.emit();
    this.openScanner = false;
    this.noProductInBBDD = true;

    setTimeout(() => {
      this.noProductInBBDD = false;
      window.location.reload();
    }, 3000);
  }
}
