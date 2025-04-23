import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barcode-scanner',
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css'
})
export class BarcodeScannerComponent {
  @Output() scanResult = new EventEmitter<string>();//Modal

  productInfo: { [key: string]: { name: string, description: string, calories?: number, price: string, brand: string } } = {
    '8720181027796': { name: 'Desodorante Axe', description: 'Desodorante en aerosol de larga duración.', price: '3.99€', brand: 'Axe' },
    '5060326275280': { name: 'Creatina', description: 'Suplemento deportivo para mejorar el rendimiento.', calories: 0, price: '19.99€', brand: 'MyProtein' },
    '8470001518422': { name: 'Toallitas Blefarix', description: 'Toallitas para la higiene ocular, suaves y efectivas.', price: '9.50€', brand: 'Blefarix' },
    '8437000663935': { name: 'Agua', description: 'Botlla de agua', price: '0.50€', brand: 'Teleno' }
  };

  scannedCode: string = '';
  productDetails: any = null;
  isValid: boolean | null = null;
  
  // Definir los formatos de código de barras permitidos correctamente
  formats = [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];

  onScanSuccess(event: any) {
    const result = event as string; // Asegurar que el evento se maneje como string
    this.scannedCode = result;
  
    console.log('Código de barras escaneado:', result); // Mostrar en la terminal
  
    if (this.productInfo[result]) {
      this.productDetails = this.productInfo[result];
      this.isValid = true;
    } else {
      this.productDetails = { name: 'Producto no encontrado', description: '' };
      this.isValid = false;
    }
    this.scanResult.emit(result);//Modal
  }
}
