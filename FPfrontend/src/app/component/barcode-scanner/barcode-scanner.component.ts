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

  public apiProductsUrl: string = "http://localhost:8000/api/data";
  public productsUser: any[] = [];
  public barcodeUserProducts: { [barcode: string]: any } = {};

  public isModalOpen: boolean = false;

  public modalAction: string = '';

  scannedCode: string = '';
  productDetails: any = null;
  isValid: boolean | null = null;
  
  // Definir los formatos de código de barras permitidos correctamente
  formats = [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];

  ngOnInit() {
    this.getUserProducts();
    console.log('Modal status', this.isModalOpen);
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }

  onScanSuccess(event: any) {
    const result = event as string; // Asegurar que el evento se maneje como string
    this.scannedCode = result;
  
    console.log('Código de barras escaneado:', result); 
  
    if (this.barcodeUserProducts[result]) {
      this.productDetails = this.barcodeUserProducts[result];
      this.isValid = true;
      //this.addScannProduct();
      console.log('Producto con codigo ', result , ' añadido correctamente a la base de datos'); 
      console.log('Producto escaneado: ', this.productDetails)
      //REVISAR BIEN LA CONDICION DEL ELSE
    } else {
      this.productDetails = { name: 'Producto no encontrado', description: '' };
      this.isValid = false;
    }
    this.scanResult.emit(result);//Modal
  }

  /*
  public addScannProduct(): void {
    let selectOneProductUrl = `${this.apiProductsUrl}/${this.productId}`;

    let stockToNumber = parseInt(this.productForm.value.stock ?? '0');

    const products: ProductAllData = {
      id: null,
      stock: stockToNumber,
    };

    this.service.editProduct(selectOneProductUrl, products).subscribe({
      next: (response) => {
        console.log('Producto modificado:', response);
      },
      error: (error) => {
        console.error('Error al modificar el producto:', error);
      }
    });
  }
*/
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
