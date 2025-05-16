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

  // API endpoints
  private readonly apiWarehouseUrl: string = "http://127.0.0.1:8000/api/warehouse";
  private readonly apiProductsUrl: string = "http://localhost:8000/api/data";

  // Modal state management
  currentModalState: ModalState = 'closed';
  
  // Data management
  warehouses: Warehouse[] = [];
  warehouseID: number = 0;
  productData = {
    name: '',
    brand: '',
    expirationDate: '',
    quantity: '',
    protein: '',
    nutriscore: '',
    ecoscore: '',
    imageUrl: ''
  };

  productForm = new FormGroup({
    soldPrice: new FormControl('', [Validators.required, Validators.min(0)]),
    purchasePrice: new FormControl('', [Validators.required, Validators.min(0)]),
    expirationDate: new FormControl('', [Validators.required])
  });

  ngOnInit() {
    if (this.openScanner) {
      this.setModalState('scanner');
    }
  }

  ngOnChanges() {
    if (this.openScanner) {
      this.setModalState('scanner');
    } else {
      this.setModalState('closed');
    }
  }

  private setModalState(state: ModalState) {
    this.currentModalState = state;
    
    if (state === 'closed') {
      this.closeModal.emit();
      this.resetData();
    }
  }

  private resetData() {
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
    this.setModalState('scanned');
    setTimeout(() => {
      this.setModalState('closed');
    }, 3000);
  }

  public insertNewDataOptions(): void {
    this.loadProductData();
    this.checkWarehouses();
    this.setModalState('selectWarehouse');
  }

  public selectWarehouse(warehouseId: string): void {
    const id = +warehouseId;
    if (!id) {
      console.warn('ID inválido o vacío:', warehouseId);
      return;
    }
    this.warehouseID = id;
    this.setModalState('productInfo');
  }

  public addApiProduct(): void {
    this.setModalState('formData');
  }

  public checkWarehouses(): void {
    const userIdString = localStorage.getItem('userId');
    if (!userIdString) {
      console.error('Error: No se encontró userId en localStorage');
      return;
    }

    const userId = parseInt(userIdString, 10);
    const apiUrl = `${this.apiWarehouseUrl}/user/${userId}`;

    this.service.takeWarehouse(apiUrl).subscribe({
      next: (response) => {
        this.warehouses = response;
      },
      error: (error) => {
        console.error('Error fetching warehouses:', error);
        this.setModalState('closed');
      }
    });
  }

  public addProduct(): void {
    if (!this.productForm.valid) {
      console.warn('Formulario inválido');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const barcode = localStorage.getItem('barcode');
    
    const products: ProductAllData = {
      id: null,
      warehouse: this.warehouseID,
      name: this.productData.name,
      brand: this.productData.brand,
      price: Number(this.productForm.value.soldPrice) || 0,
      stock: 1,
      barcode: barcode ? Number(barcode) : null,
      product_type: 'alimenticio',
      entry_date: today,
      expiration_date: this.productForm.value.expirationDate || null,
      purchase_price: Number(this.productForm.value.purchasePrice) || 0
    };

    this.service.insertProductsInWarehouse(this.apiProductsUrl, products).subscribe({
      next: (response) => {
        console.log('Producto añadido con éxito:', response);
        this.openCheckWindows();
      },
      error: (error) => {
        console.error('Error al añadir producto:', error);
        this.setModalState('closed');
      }
    });
  }
}
