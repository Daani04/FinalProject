import { Component, Host } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';
import { FooterComponent } from "../../component/footer/footer.component";
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { Warehouse } from '../../models/response.interface';
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
  private apiLocationUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';

  public cont: number = 0;
  public cont2: number = 0; 

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

  public toggleForm(): void {
    this.cont = 1;
  }

  public getStreetForm(): void {
    this.getLocation();
    //this.newWarehouse();
    this.getLocationCoordinates(this.reactiveForm.value.locationWarehouseCity, this.reactiveForm.value.locationWarehouseStreet, this.reactiveForm.value.locationWarehouseCommunity);
    console.log(this.reactiveForm.value);
  }

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

  getLocationCoordinates(city: any, street: any, comunity: any ) {
    this.service.getLocationCoordinates(city, street, comunity).subscribe(
      (res) => {
        let coordinates = res.choices[0].message.content;
        //let notifications = notificationContent.split('!');
        console.log(coordinates);
        this.newWarehouse(coordinates);
        
      },
      (error) => {
        console.error('Error al generar notificación:', error);
      }
    );
  }

  //NO FUNCIONA!!####################################################################################
  public newWarehouse(coordinates: any): void {
    const userIdString = localStorage.getItem('userId'); // Obtiene el userId como string

    if (!userIdString) {
        console.error('Error: No se encontró userId en localStorage');
        return;
    }

    const userId = parseInt(userIdString, 10); // Convierte userId a número

    if (isNaN(userId)) {
        console.error('Error: userId en localStorage no es un número válido');
        return;
    }

    const warehouseData: Warehouse = {
        id: null,  
        userId: { id: userId } as User,  // Se asigna un objeto User con solo el ID
        warehouseName: this.reactiveForm.value.warehouseName ?? '',
        location: coordinates ?? '',
    };

    this.service.createWarehouse(this.apiWarehouseUrl, warehouseData).subscribe(
        (response) => console.log('Almacén creado con éxito:', response),
        (error) => console.error('Error al crear almacén:', error)
    );
}
//#################################################################################################
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
