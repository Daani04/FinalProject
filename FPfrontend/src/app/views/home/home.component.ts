import { Component, Host } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';
import { FooterComponent } from "../../component/footer/footer.component";
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { ProductAllData, ProductSold, Warehouse } from '../../models/response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ModalScannerComponent } from "../../component/modal-scanner/modal-scanner.component";
import { NgStyle } from '@angular/common';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [ChartComponent, FooterComponent, ReactiveFormsModule, RouterModule, ModalScannerComponent, NgStyle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(public service: RequestService, private http: HttpClient) { }

  @ViewChild('chartComponentLineEntrateProducts') chartComponentLineEntrateProducts!: ChartComponent;
  @ViewChild('chartComponentLineExitProducts') chartComponentLineExitProducts!: ChartComponent;

  public apiWarehouseUrl: string = "http://127.0.0.1:8000/api/warehouse";
  public apiProductsUrl: string = "http://localhost:8000/api/data";
  private apiLocationUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';
  public apiSalesUrl: string = "http://localhost:8000/api/sales";

  public userName = localStorage.getItem('username');

  public warehouses: Warehouse[] = [];
  public products: ProductAllData[] = [];
  public selectedWarehouseId: number = 0;

  public productsSold: ProductSold[] = [];
  public productsSoldQuantity: number[] = [];

  public cont: number = 0;
  public cont2: number = 0;

  public loading: boolean = false;
  public changueScreen: boolean = false;

  public selectedWarehouse: boolean = false;

  public showForm: boolean = false;

  public contInsertionData: number = 0;

  public userLocation: string = '';

  public openModalScanner: boolean = false;

  public filtratedProductsforWarehouseId: any[] = [];
  public productsUser: any[] = [];

  public page: number = 0;
  public itemsPerPage: number = 4;
  public totalPages: number = 0;
  public actualPage: number = 1;

  public randomWarehouseName: string = '';

  public saleProductsForMonth: number[] = [];
  public entrateProductsForMonth: number[] = [];
    
  public insertionMethod(): void {
    this.contInsertionData = 1;
  }

  productForm = new FormGroup({
    name: new FormControl(''),
    brand: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
    barcode: new FormControl(''),
    productType: new FormControl(''),
    expirationDate: new FormControl(''),
    entryDate: new FormControl(''),
    productPhoto: new FormControl(''),
    purchasePrice: new FormControl('')
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

  public showOptionForInsertData(): void {
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
    //this.newWarehouse();
    this.getLocationCoordinates(this.reactiveForm.value.locationWarehouseCity, this.reactiveForm.value.locationWarehouseStreet, this.reactiveForm.value.locationWarehouseCommunity);
    console.log(this.reactiveForm.value);
  }

  public showProducts(): void {
    this.products = this.filtratedProductsforWarehouseId.slice(this.page, this.page + this.itemsPerPage);
  }

  public takePage(): void {
    const takeActualPage = Math.floor(this.page / this.itemsPerPage) + 1;
    const totalPages = Math.ceil(this.filtratedProductsforWarehouseId.length / this.itemsPerPage);

    this.actualPage = takeActualPage;
    this.totalPages = totalPages;
  }

  public nextPage(): void {
    if (this.page + this.itemsPerPage < this.filtratedProductsforWarehouseId.length) {
      this.page += this.itemsPerPage;
      this.showProducts();
    }
    this.takePage();
  }

  public beforePage(): void {
    if (this.page > 0) {
      this.page -= this.itemsPerPage;
      this.showProducts();
      this.takePage();
    }
  }

  getLocationCoordinates(city: any, street: any, comunity: any) {
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

        let randomIndex = Math.floor(Math.random() * this.warehouses.length);
        let randomWarehouse = this.warehouses[randomIndex];
        this.takeWarehouseProducts(randomWarehouse.id);
        this.randomWarehouseName = randomWarehouse.name ?? '';
      },
      error: (error) => {
        console.error('Error fetching warehouses:', error);
      }
    });
  }

  public insertProductsWarehouse(): void {

    let priceToNumber = parseFloat(this.productForm.value.price ?? '0');
    let stockToNumber = parseInt(this.productForm.value.stock ?? '0');
    let barcodeToNumber = parseInt(this.productForm.value.barcode ?? '0');
    let purchasePriceToNumber = parseFloat(this.productForm.value.purchasePrice ?? '0');


    const products: ProductAllData = {
      id: null,
      warehouse: this.selectedWarehouseId,
      name: this.productForm.value.name ?? '',
      brand: this.productForm.value.brand ?? '',
      price: priceToNumber,
      stock: stockToNumber,
      barcode: barcodeToNumber,
      product_type: this.productForm.value.productType ?? '',
      entry_date: this.productForm.value.entryDate ?? '',
      expiration_date: this.productForm.value.expirationDate || null,
      product_photo: this.productForm.value.productPhoto || null,
      purchase_price: purchasePriceToNumber
    };

    this.service.insertProductsInWarehouse(this.apiProductsUrl, products).subscribe(
      (response) => console.log('Producto añadido con exito:', response),
      (error) => console.error('Error al añadir producto:', error)
    );
  }

  public takeWarehouseProducts(warehouse_id: any): void {
    this.loading = true;
    this.changueScreen = true;

    let userIdString = localStorage.getItem('userId');

    if (!userIdString) {
      console.error('Error: No se encontró userId en localStorage');
      return;
    }

    let userId = parseInt(userIdString, 10);
    let apiUrl = `${this.apiProductsUrl}/user/${userId}`;

    this.service.takeProducts(apiUrl).subscribe({
      next: (response) => {
        this.loading = false;
        this.changueScreen = false;
        this.productsUser = response;
        this.filtratedProductsforWarehouseId = [];

        for (let i = 0; i < this.productsUser.length; i++) {
          if (this.productsUser[i].warehouse == warehouse_id) {
            this.filtratedProductsforWarehouseId.push(this.productsUser[i]);
          }
        }

        this.page = 0;
        this.showProducts();
        this.takePage();
        this.getProductsSold();
        console.log('Productos(P): ', this.productsUser);
      },
      error: (error) => {
        this.loading = false;
        this.changueScreen = false;
        console.error('Error al sacar los productos:', error);
      }
    });
  }
//-----------------------------------------------GENERAR GRAFICOS(Saca los productos vendidos, pero solo se usan en los graficos)------//
  public getProductsSold(): void {
    let userIdString = localStorage.getItem('userId');
  
    if (!userIdString) {
      console.error('Error: No se encontró userId en localStorage');
      return;
    }
  
    let userId = parseInt(userIdString, 10);
  
    let apiUrl = `${this.apiSalesUrl}/user/${userId}`;
  
    this.service.takeProducts(apiUrl).subscribe({
      next: (response) => {
        this.productsSold = response;
        this.productsSoldQuantity = this.productsSold.map((product: any) => product.quantity);
        console.log(this.productsSold);
        this.calculateMonthlySalesAndStock();
      },
      error: (error) => {
        console.error('Error al sacar los productos:', error);
      }
    });
  }
//--------------------------------------------------------------------------------------------------------//
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
  //------------------------------------------------GENERAR GRAFICOS CON DATOS BBDD-------------------------------//
  public calculateMonthlySalesAndStock(): void {
    console.log('Productos(OP)', this.productsUser); 
    let actualYear = new Date().getFullYear();
    let salesForMonth = new Array(12).fill(0);
    let stockForMonth = new Array(12).fill(0);
  
    for (let i = 0; i < this.productsSold.length; i++) {
      let fecha = new Date(this.productsSold[i].sale_date.replace(" ", "T"));
      if (fecha.getFullYear() === actualYear) {
        let month = fecha.getMonth();
        salesForMonth[month] += this.productsSoldQuantity[i] || 0;
      }
    }
  
    for (let i = 0; i < this.productsUser.length; i++) {
      let product = this.productsUser[i];
      if (product.entry_date) {
        let month = new Date(product.entry_date).getMonth();
        stockForMonth[month] += product.stock;
      }
    }
  
    let unsoldProducts = stockForMonth.map((stock, i) => stock - salesForMonth[i]);
  
    this.saleProductsForMonth = salesForMonth;
    this.entrateProductsForMonth = unsoldProducts;
  
    this.reloadGraphics();
  }

  
  public reloadGraphics(): void {
  if (this.saleProductsForMonth.length > 0) {
      this.lineExitProducts.datasets[0].data = this.saleProductsForMonth;
  }
  if (this.entrateProductsForMonth.length > 0) {
      this.lineEntrateProducts.datasets[0].data = this.entrateProductsForMonth;
  }

  if (this.lineEntrateProducts.datasets[0].data.length > 0 && this.chartComponentLineEntrateProducts) {
    this.chartComponentLineEntrateProducts.updateChart();
  }
  if (this.lineExitProducts.datasets[0].data.length > 0 && this.chartComponentLineExitProducts) {
    this.chartComponentLineExitProducts.updateChart();
  }
  console.log('Salida de productos', this.saleProductsForMonth);
  console.log('Entrada de productos', this.entrateProductsForMonth);
 }
 //------------------------------------------------------------------------------------------------------//

 public lineExitProducts: any = {  
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [{
    label: 'Salida de productos',
    data: [],  
    borderColor: '#6F4D94', 
    borderWidth: 2,
    fill: false
  }]
};

public lineEntrateProducts: any = {  
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  datasets: [{
    label: 'Entrada de productos',
    data: [],  
    borderColor: '#9A8BCA', 
    borderWidth: 2,
    fill: false
  }]
};

}
