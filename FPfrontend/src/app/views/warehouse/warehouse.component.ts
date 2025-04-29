import { Component } from '@angular/core';
import { FooterComponent } from "../../component/footer/footer.component";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { Warehouse } from '../../models/response.interface';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/response.interface';


@Component({
  selector: 'app-warehouse',
  imports: [FooterComponent, ReactiveFormsModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css'
})
export class WarehouseComponent {

  constructor(public service: RequestService, private http: HttpClient) { }
  
  public apiWarehouseUrl: string = "http://127.0.0.1:8000/api/warehouse";


  public formWarehouse: boolean = false;
  public userLocation: string = '';



  public controlForm(): void {
    if (this.formWarehouse === false) {
      this.formWarehouse = true;
    } else {
      this.formWarehouse = false;
    }
  }

  reactiveForm = new FormGroup({
    openForm: new FormControl(''),
    warehouseName: new FormControl(''),
    locationWarehouseCity: new FormControl(''),
    locationWarehouseStreet: new FormControl(''),
    locationWarehouseCommunity: new FormControl('')
  });

  public getStreetForm(): void {
    this.newWarehouse();
    this.getLocationCoordinates(this.reactiveForm.value.locationWarehouseCity, this.reactiveForm.value.locationWarehouseStreet, this.reactiveForm.value.locationWarehouseCommunity);
    console.log(this.reactiveForm.value);
  }

  getLocationCoordinates(city: any, street: any, comunity: any) {
    this.service.getLocationCoordinates(city, street, comunity).subscribe(
      (res) => {
        let coordinates = res.choices[0].message.content;
        //let notifications = notificationContent.split('!');
        console.log(coordinates);

      },
      (error) => {
        console.error('Error al generar notificación:', error);
      }
    );
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

}
