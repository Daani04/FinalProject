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
  @Output() barcodeCheck = new EventEmitter<void>();

  @Input() scannerAction: string = '';

  public apiProductsUrl: string = "http://localhost:8000/api/data";
  public productsUser: any[] = [];
  public barcodeUserProducts: { [barcode: string]: any } = {};

  public isModalOpen: boolean = false;

  public modalAction: string = '';

  private isProcessing = false;
  public scannedCode: string = '';
  public productDetails: any = null;
  public isValid: boolean | null = null;
  
  // Definir los formatos de código de barras permitidos correctamente
  formats = [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];

  ngOnInit() {
    this.getUserProducts();
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }

  onScanSuccess(event: any) {
  let result = event as string;

  if (this.isProcessing || result === this.scannedCode) return; //Evita escanear mas de una vez el codigo, de forma que si el codigo que acaba de leer es igual que el anterior devuelve un return y sale de la funcion
  this.isProcessing = true;
  this.scannedCode = result;

  if (this.barcodeUserProducts[result]) {
    this.productDetails = this.barcodeUserProducts[result];
    this.isValid = true;

    this.addScannProduct();
    console.log('Producto escaneado con exito:', this.productDetails);
  } else {
    this.getProductFromOpenFoodFacts(this.scannedCode);
    this.isValid = false;
    console.log('Producto con codigo de barras ', this.scannedCode, 'no encontrado');
    localStorage.setItem('barcode', this.scannedCode);
  }
  this.scanResult.emit(result);

    setTimeout(() => {
    this.isProcessing = false;
  }, 2000);
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
      },
      error: (error) => {
        console.error('Error al sacar los productos:', error);
      }
    });
  }

  //Conexion con la API de busqueda de comida
  getProductFromOpenFoodFacts(barcode: string) {
  let url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  this.http.get<any>(url).subscribe({
    next: (response) => {
      if (response.status === 1) { // Producto encontrado
        let product = response.product;
        
        const filteredProduct = {
          name: product.product_name || 'Nombre no disponible',
          brand: product.brands || 'Marca no disponible',
          quantity: product.quantity || 'Cantidad no disponible',
          protein: product.nutriments?.proteins_100g?.toString() || 'No disponible',
          expirationDate: product.expiration_date || 'Fecha de caducidad no disponible',
          nutriscore: product.nutriscore_grade || 'Sin calificación',
          ecoscore: product.ecoscore_score !== undefined ? product.ecoscore_score : 'Sin puntuación',
          imageUrl: product.image_url || ''
        };
        
        localStorage.setItem('product_name', filteredProduct.name);
        localStorage.setItem('product_brand', filteredProduct.brand);
        localStorage.setItem('product_expiration_date', filteredProduct.expirationDate);
        
        localStorage.setItem('product_quantity', filteredProduct.quantity);
        localStorage.setItem('product_protein', filteredProduct.protein);
        localStorage.setItem('product_nutriscore', filteredProduct.nutriscore);
        localStorage.setItem('product_ecoscore', filteredProduct.ecoscore.toString());
        localStorage.setItem('product_image_url', filteredProduct.imageUrl);

        this.barcodeCheck.emit();
        console.log('Producto filtrado:', product);
      } else {
        console.log('Producto no encontrado en OpenFoodFacts');
      }
    },
    error: (error) => {
      console.error('Error al llamar a OpenFoodFacts', error);
    }
  });
}


}
