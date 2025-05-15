import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BarcodeScannerComponent } from "../barcode-scanner/barcode-scanner.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductAllData, Warehouse } from '../../models/response.interface';
import { RequestService } from '../../services/request.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-scanner',
  imports: [BarcodeScannerComponent, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './modal-scanner.component.html',
  styleUrl: './modal-scanner.component.css'
})
export class ModalScannerComponent {
  constructor(public service: RequestService, private http: HttpClient) { }

  @Input() openScanner: boolean = false;
  @Input() scannerAction: string = '';
  @Input() barcodeCheck: string = '';

  @Output() closeModal = new EventEmitter<void>();

  public apiWarehouseUrl: string = "http://127.0.0.1:8000/api/warehouse";
  public apiProductsUrl: string = "http://localhost:8000/api/data";

  public warehouses: Warehouse[] = [];
  public warehouseID: number = 0;

  public isModalScanned: boolean = false;
  public insertDataOptions: boolean = false;

  public selectWareHouse: boolean = false;
  public takeApiProduct: boolean = false;
  public visibleFormData: boolean = false;

  public name: string = '';
  public brand: string = '';
  public purchasePrice: string = '';
  public salePrice: string = '';
  public expirationDate: string = '';

    productForm = new FormGroup({
    soldPrice: new FormControl(''),
    purchasePrice: new FormControl(''),
    expirationDate: new FormControl(''),
  });

  onSubmit(): void {
    console.log('Formulario enviado', this.productForm.value);
  }


  public closeModalScanner(): void {
    this.closeModal.emit();
    this.openScanner = false;
    window.location.reload();
  }

  public closeModalOptions(): void {
    this.openScanner = false;
    this.insertDataOptions = false;
    this.selectWareHouse = false
    window.location.reload();
  }

  public openCheckWindows(): void {
    this.closeModal.emit();
    this.openScanner = false;
    this.isModalScanned = true;

    setTimeout(() => {
      this.isModalScanned = false;
    }, 3000);
  }

  public insertNewDataOptions(): void {
    this.openScanner = false;
    this.insertDataOptions = true;
    this.selectWareHouse = true

    this.name = localStorage.getItem('product_name') ?? '';
    this.brand = localStorage.getItem('product_brand') ?? '';
    this.purchasePrice = localStorage.getItem('product_purchase_price') ?? '';
    this.expirationDate = localStorage.getItem('product_expiration_date') ?? '';

    this.checkWarehouses();
  }

  public selectWarehouse(warehouseId: any): void {
    this.selectWareHouse = false;
    this.takeApiProduct = true;
    let id = +warehouseId;//Combierte la warehouseId a numerico

    if (!id) {
      console.warn('ID inválido o vacío:', warehouseId);
      return;
    }
    this.warehouseID = id;
    console.log('Almacén seleccionado:', id);
  }

  public addApiProduct(): void {
    this.openScanner = false;
    this.insertDataOptions = false;
    this.selectWareHouse = false
    this.visibleFormData = true;
  }

  public callInsertDataFunction(): void {
    let id = this.warehouseID;
    //this.addProduct(id);
  }


  public checkWarehouses(): void {
    let userIdString = localStorage.getItem('userId');

    if (!userIdString) {
      console.error('Error: No se encontró userId en localStorage');
      return;
    }

    let userId = parseInt(userIdString, 10);

    let apiUrl = `${this.apiWarehouseUrl}/user/${userId}`;

    this.service.takeWarehouse(apiUrl).subscribe({
      next: (response) => {
        this.warehouses = response;
      },
      error: (error) => {
        console.error('Error fetching warehouses:', error);
      }
    });
  }

  /*
  public addProduct(warehouseId: number): void {
    const products: ProductAllData = {
      id: null,
      warehouse: warehouseId,
      name: this.name,
      brand: this.brand ?? '',
      price: this.purchasePrice,
      stock: 1,
      barcode: barcodeToNumber,
      product_type: this.productForm.value.productType ?? '',
      entry_date: this.productForm.value.entryDate ?? '',
      expiration_date: this.productForm.value.expirationDate || null,
      purchase_price: purchasePriceToNumber
    };

    this.service.insertProductsInWarehouse(this.apiProductsUrl, products).subscribe(
      (response) => {
        console.log('Producto añadido con exito:', response);
      },
      (error) => console.error('Error al añadir producto:', error)
    );
  }
  */
}
