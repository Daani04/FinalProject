import { Component, Host } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';
import { FooterComponent } from "../../component/footer/footer.component";
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { ProductAllData, Warehouse } from '../../models/response.interface';
import { User } from '../../models/response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { BarcodeScannerComponent } from "../../component/barcode-scanner/barcode-scanner.component";
import { DeepseekComponent } from "../../component/deepseek/deepseek.component";
import { Overrides } from 'chart.js';
import { ModalScannerComponent } from "../../component/modal-scanner/modal-scanner.component";

@Component({
  selector: 'app-home',
  imports: [ChartComponent, FooterComponent, ReactiveFormsModule, RouterModule, ModalScannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  

  constructor(public service: RequestService, private http: HttpClient) { }

  public apiWarehouseUrl: string = "http://127.0.0.1:8000/api/warehouse";
  public apiProductsUrl: string = "http://localhost:8000/api/data";
  private apiLocationUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';

  public warehouses: Warehouse[] = [];
  public selectedWarehouseId: number = 0;

  public cont: number = 0;
  public cont2: number = 0; 

  public selectedWarehouse: boolean = false;

  public showForm: boolean = false;

  public contInsertionData: number = 0;

  public userLocation: string = '';

  public openModalScanner: boolean = false;

  public insertionMethod(): void {
    this.contInsertionData = 1;
  }

  productForm = new FormGroup({
    name: new FormControl(''),
    brand: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
    productType: new FormControl(''),
    expirationDate: new FormControl(''),
    warrantyPeriod: new FormControl(''),
    weight: new FormControl(''),
    dimensions: new FormControl(''),
    entryDate: new FormControl(''),
    productPhoto: new FormControl('')
  });

  onSubmit(): void {
      console.log('Formulario enviado', this.productForm.value);
  }


  getStreet(lat: number, lon: number): Observable<string> {
    const url = `${this.apiLocationUrl}&lat=${lat}&lon=${lon}`;
    return this.http.get<any>(url).pipe(
      map(response => 
        response.address?.village || 
        response.address?.town || 
        response.address?.city || 
        'Localidad no encontrada' 
      )
    );
  }

  reactiveForm = new FormGroup({
    openForm: new FormControl(''),
    warehouseName: new FormControl(''),
    locationWarehouseCity: new FormControl(''),
    locationWarehouseStreet: new FormControl(''),
    locationWarehouseCommunity: new FormControl('')
  });

  selectWarehouseForInsertProducts = new FormGroup({
    selectWarehouse: new FormControl('')
  });

  public showOptionForInsertData(): void{
    this.selectedWarehouse = true;
    console.log(this.selectWarehouseForInsertProducts.value.selectWarehouse);

    for (let i = 0; i < this.warehouses.length; i++) {
      if (this.warehouses[i].name === this.selectWarehouseForInsertProducts.value.selectWarehouse) {
        this.selectedWarehouseId = this.warehouses[i].id ?? 0;
        break; 
      }
    }
  }

  public uploadProducts(): void {
    this.insertProductsWarehouse();
  }

  public toggleForm(): void {
    this.cont = 1;
  }

  public getStreetForm(): void {
    //this.getLocation();
    //this.newWarehouse();
    this.getLocationCoordinates(this.reactiveForm.value.locationWarehouseCity, this.reactiveForm.value.locationWarehouseStreet, this.reactiveForm.value.locationWarehouseCommunity);
    console.log(this.reactiveForm.value);
  }

  /*
  public getLocation(): void {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Ubicación obtenida:", position.coords);
          this.getStreet(position.coords.latitude, position.coords.longitude).subscribe(
            (pueblo) => {
              this.userLocation = pueblo;
              console.log("Localidad obtenida:", this.userLocation);  
            },
            (error) => {
              console.error("Error obteniendo la localidad:", error);
              this.userLocation = "Error obteniendo la localidad";
            }
          );
        },
        (error) => {
          this.userLocation = `Error: ${error.message}`;
          console.error("No se pudo obtener la ubicación:", this.userLocation);
        }
      );
    } else {
      this.userLocation = "Error: Geolocalización no soportada";
      console.error(this.userLocation);
    }
  }
*/
  getLocationCoordinates(city: any, street: any, comunity: any ) {
    this.service.getLocationCoordinates(city, street, comunity).subscribe(
      (res) => {
        let coordinates = res.choices[0].message.content;
        console.log(coordinates);
        this.newWarehouse(coordinates);
        
      },
      (error) => {
        console.error('Error al generar notificación:', error);
      }
    );
  }

  ngOnInit(): void {
    this.checkWarehouses();
  }

  public newWarehouse(coordinates: any): void {
    let userIdString = localStorage.getItem('userId'); // Obtiene el userId como string
    let coordinatesString = String(coordinates); 

    if (!userIdString) {
        console.error('Error: No se encontró userId en localStorage');
        return;
    }

    let userId = parseInt(userIdString, 10); // Convierte userId a número

    if (isNaN(userId)) {
        console.error('Error: userId en localStorage no es un número válido');
        return;
    }
    console.log('Id del usuario', userId);
    console.log('Nombre del almacen', this.reactiveForm.value.warehouseName);
    console.log('Coordenadas del almacen', coordinatesString);

    const warehouseData: Warehouse = {
      id: null,  
      user_id: userId,  
      name: this.reactiveForm.value.warehouseName ?? '',  
      location: coordinatesString ?? '',  
    };

    console.log('Datos enviados al servidor:', warehouseData);

    this.service.createWarehouse(this.apiWarehouseUrl, warehouseData).subscribe(
        (response) => console.log('Almacén creado con éxito:', response),
        (error) => console.error('Error al crear almacén:', error)
    );
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
      /*
      for (let i = 0; i < this.warehouses.length; i++) {
        console.log(this.warehouses[i].name);
      }
        */
    },
    error: (error) => {
      console.error('Error fetching warehouses:', error);
    }
  });
}


public insertProductsWarehouse(): void {

  let priceToNumber = parseFloat(this.productForm.value.price ?? '0');
  let stockToNumber = parseInt(this.productForm.value.stock ?? '0');
  let wigthToNumber = parseFloat(this.productForm.value.weight ?? '0');
  let dimensionsToNumber = parseFloat(this.productForm.value.dimensions ?? '0');


  const products: ProductAllData = {
    id: null,
    warehouse: this.selectedWarehouseId,
    name: this.productForm.value.name ?? '',
    brand: this.productForm.value.brand ?? '',
    price: priceToNumber,
    stock: stockToNumber,
    product_type: this.productForm.value.productType ?? '',
    entry_date: this.productForm.value.entryDate ?? '', 
    expiration_date: this.productForm.value.expirationDate || null,
    warranty_period: this.productForm.value.warrantyPeriod || null,
    weight:  wigthToNumber,
    dimensions:  dimensionsToNumber,
    product_photo: this.productForm.value.productPhoto || null
  };

  this.service.insertProductsInWarehouse(this.apiProductsUrl, products).subscribe(
    (response) => console.log('Almacén creado con éxito:', response),
    (error) => console.error('Error al crear almacén:', error)
);
  
}


public changeShowForm(): void {
    if (this.showForm === false) {
      this.showForm = true;
    } else {
      this.showForm = false;
    }
  }

  public closeWarehouse(): void {
    this.cont = 0;
  }

  public closeProducts(): void {
    this.showForm = false;
  }

  public openModal(): void {
    this.openModalScanner = true;
  }

  public closeModal(): void {
    this.openModalScanner = false;
  }

  public lineExitProducts = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Entrada de productos',
      data: [5, 15, 10, 20, 18],
      borderColor: '#8F5B8C', 
      borderWidth: 2,
      fill: false
    }]
  };
  
  public lineEntrateProducts = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Salida de productos',
      data: [5, 15, 10, 20, 18],
      borderColor: '#6F4D94', 
      borderWidth: 2,
      fill: false
    }]
  };

}
