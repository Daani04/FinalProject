import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library'; 
import { CommonModule } from '@angular/common';
import { RequestService } from '../../services/request.service';
import { HttpClient } from '@angular/common/http';
import { ProductAllData, User } from '../../models/response.interface';
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-barcode-scanner',
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css'
})
export class BarcodeScannerComponent {

  constructor(public service: RequestService, private http: HttpClient) { }

  @Output() scanResult = new EventEmitter<string>();
  @Output() scanCompleted = new EventEmitter<void>();

  @Input() scannerAction: string = '';

  public apiProductsUrl: string = "http://localhost:8000/api/data";
  public productsUser: any[] = [];
  public barcodeUserProducts: { [barcode: string]: any } = {};

  public isModalOpen: boolean = false;

  public modalAction: string = '';

  public openCehckModal: boolean = false;

  scannedCode: string = '';
  productDetails: any = null;
  isValid: boolean | null = null;
  
  // Definir los formatos de código de barras permitidos correctamente
  formats = [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];

  ngOnInit() {
    this.getUserProducts();
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }

  onScanSuccess(event: any) {
  const result = event as string;

  if (result === this.scannedCode) return;
  this.scannedCode = result;

  if (this.barcodeUserProducts[result]) {
    this.productDetails = this.barcodeUserProducts[result];
    this.isValid = true;

    this.addScannProduct();

    console.log('Producto escaneado con exito:', this.productDetails);
  } else {
    this.productDetails = { name: 'Producto no encontrado', description: '' };
    this.isValid = false;
  }
  this.scanResult.emit(result);
}

  
  public addScannProduct(): void {
    let selectOneProductUrl = `${this.apiProductsUrl}/${this.productDetails.id}`;

    let updateStock = this.productDetails.stock;

    if (this.scannerAction === "moveProductToSold" && updateStock !== 0) {
      updateStock -= 1;
    } else if(this.scannerAction === "addProductToStock") {
      updateStock += 1;
    }

    const products: ProductAllData = {
      id: null,
      warehouse: this.productDetails.warehouse,
      name: this.productDetails.name,
      brand: this.productDetails.brand,
      price: this.productDetails.price,
      product_type: this.productDetails.product_type,
      entry_date: this.productDetails.entry_date, 
      expiration_date: this.productDetails.expiration_date,
      purchase_price: this.productDetails.purchase_price,
      barcode: this.productDetails.barcode,

      stock: updateStock //Unico campo que se modifica, los demas mantienen el valor 
    };

    this.service.editProduct(selectOneProductUrl, products).subscribe({
      next: (response) => {
        console.log('Producto modificado:', response);
          this.scanCompleted.emit();
          this.openCehckModal = true;
      },
      error: (error) => {
        console.error('Error al modificar el producto:', error);
      }
    });
  }


  public getUserProducts(): void {
    let userIdString = localStorage.getItem('userId');

    if (!userIdString) {
      console.error('Error: No se encontró userId en localStorage');
      return;
    }

    let userId = parseInt(userIdString, 10);
    let apiUrl = `${this.apiProductsUrl}/user/${userId}`;

    this.service.takeProducts(apiUrl).subscribe({
      next: (response) => {
        this.productsUser = response;

        this.productsUser.forEach((product) => {
          if (product.barcode) {
            this.barcodeUserProducts[product.barcode] = product;
          }
        });
        console.log('Codigo de barras: ', this.barcodeUserProducts);
      },
      error: (error) => {
        console.error('Error al sacar los productos:', error);
      }
    });
  }

}
