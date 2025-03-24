import { Component } from '@angular/core';
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
@Component({
  selector: 'app-home',
  imports: [ChartComponent, FooterComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(public service: RequestService, private http: HttpClient) { }

  public apiWarehouseUrl: string = "http://127.0.0.1:8000/api/warehouse";
  private apiLocationUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';

  public cont: number = 0;
  public cont2: number = 0;

  public userLocation: string = '';

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
  });

  public toggleForm(): void {
    this.cont = 1;
    this.getLocation();
    this.newWarehouse();
  }

  public getLocation(): void {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Ubicación obtenida:", position.coords);
          this.getStreet(position.coords.latitude, position.coords.longitude).subscribe(
            (pueblo) => {
              this.userLocation = pueblo;
              console.log("Localidad obtenida:", this.userLocation);  // ✅ Ahora se guarda el pueblo/ciudad
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

  public newWarehouse(): void {
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
        location: this.userLocation ?? '',
    };

    this.service.createWarehouse(this.apiWarehouseUrl, warehouseData).subscribe(
        (response) => console.log('Almacén creado con éxito:', response),
        (error) => console.error('Error al crear almacén:', error)
    );
}



  public barChart = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Ventas',
      data: [10, 20, 15, 30, 25],
      backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple'],
      borderColor: 'black',
      borderWidth: 1
    }]
  };

  public lineChart = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Crecimiento',
      data: [5, 15, 10, 20, 18],
      borderColor: 'blue',
      borderWidth: 2,
      fill: false
    }]
  };

}
