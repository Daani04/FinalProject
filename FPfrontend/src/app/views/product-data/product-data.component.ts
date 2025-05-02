import { Component } from '@angular/core';
import { FooterComponent } from "../../component/footer/footer.component";
import { NgStyle } from '@angular/common';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-data',
  imports: [FooterComponent, NgStyle, FormsModule, ReactiveFormsModule],
  templateUrl: './product-data.component.html',
  styleUrl: './product-data.component.css'
})
export class ProductDataComponent {

  //FALTA HACE LA PARTE DE LOS FILTROS, DE MOMENTO SOLO SE HAN DEFINIDO
  constructor(private route: ActivatedRoute, public service: RequestService, private http: HttpClient) {}

  public apiProductsUrl: string = "http://localhost:8000/api/data";

  public products: any[] = [];
  public page: number = 0;
  public itemsPerPage: number = 5;

  public totalPages: number = 0;
  public actualPage: number = 1;

  public viewMenu: boolean = false;
  public widthMenu: string = "60px";

  public searchQuery: string = '';
  public minPrice: number | null = null;
  public maxPrice: number | null = null;
  public productType: string = '';
  public entryDate: string = '';

  public productsUser: any[] = [];
  public filtratedProductsforWarehouseId: any[] = [];
  
  public showProducts(): void {
    this.products = this.filtratedProductsforWarehouseId.slice(this.page, this.page + this.itemsPerPage);
  }
  
  ngOnInit(): void {
    let warehouse_id = this.route.snapshot.paramMap.get('id'); // Obtener el ID pasado a traves de la URL
    console.log('ID recibido:', warehouse_id);

    this.takeWarehouseProducts(warehouse_id); 
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

  public deployMenu(): void {
    if (this.viewMenu === false) {
      this.widthMenu = "870px";
      this.viewMenu = true;
    } else {
      this.widthMenu = "60px";
      this.viewMenu = false;
    }
  }
  
  public onSearch(): void {
    console.log(this.reactiveForm.value);
  }

  reactiveForm = new FormGroup({
    searchQuery: new FormControl(''),  
    minPrice: new FormControl(0),  
    maxPrice: new FormControl(1000),  
    productType: new FormControl(''),
    entryDate: new FormControl('')  
  });     

  public takeWarehouseProducts(warehouse_id: any): void {
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
        
        for (let i = 0; i < this.productsUser.length; i++) {
          if (this.productsUser[i].warehouse == warehouse_id) {
            this.filtratedProductsforWarehouseId.push(this.productsUser[i]);
          }
        }
        console.log(this.filtratedProductsforWarehouseId);

        this.showProducts();
        this.takePage();
        console.log('Productos', this.products);
      },
      error: (error) => {
        console.error('Error al sacar los productos:', error);
      }
    });
  }
  
}
