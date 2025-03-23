import { Component } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';
import { FooterComponent } from "../../component/footer/footer.component";
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { Warehouse } from '../../models/response.interface';
import { User } from '../../models/response.interface';

@Component({
  selector: 'app-home',
  imports: [ChartComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(public service: RequestService) { }

  public apiWarehouseUrl: string = "http://127.0.0.1:8000/api/warehouse";

  public cont: number = 0;

  public userLocation: string = '';

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
                this.userLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
                console.log("Ubicación guardada:", this.userLocation);
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
