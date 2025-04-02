import { Component } from '@angular/core';
import { FooterComponent } from "../../component/footer/footer.component";
import { NgStyle } from '@angular/common';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-data',
  imports: [FooterComponent, NgStyle, FormsModule, ReactiveFormsModule],
  templateUrl: './product-data.component.html',
  styleUrl: './product-data.component.css'
})
export class ProductDataComponent {

  //FALTA HACE LA PARTE DE LOS FILTROS, DE MOMENTO SOLO SE HAN DEFINIDO
  
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
  
  public showProducts(): void {
    this.products = this.productsData.slice(this.page, this.page + this.itemsPerPage);
  }
  
  ngOnInit(): void {
    this.showProducts();
    this.takePage();
  }

  public takePage(): void {
    const takeActualPage = Math.floor(this.page / this.itemsPerPage) + 1;
    const totalPages = Math.ceil(this.productsData.length / this.itemsPerPage);

    this.actualPage = takeActualPage;
    this.totalPages = totalPages;
}
  
  public nextPage(): void {
    if (this.page + this.itemsPerPage < this.productsData.length) {
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
  
  //Simulacro conexion a base de datos
  public productsData = [ 
    {
      "ID": 1,
      "WarehouseID": 101,
      "Name": "Laptop X200",
      "Brand": "TechBrand",
      "Price": 1200.99,
      "Stock": 15,
      "ProductType": "Electronics",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "2 years",
      "Weight": "2.5kg",
      "Dimensions": "35x24x2cm",
      "EntryDate": "2024-03-15",
      "ProductPhoto": "laptop_x200.jpg"
    },
    {
      "ID": 2,
      "WarehouseID": 102,
      "Name": "Smartphone A9",
      "Brand": "MobileTech",
      "Price": 899.50,
      "Stock": 30,
      "ProductType": "Electronics",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "1 year",
      "Weight": "180g",
      "Dimensions": "15x7x0.8cm",
      "EntryDate": "2024-02-10",
      "ProductPhoto": "smartphone_a9.jpg"
    },
    {
      "ID": 3,
      "WarehouseID": 103,
      "Name": "LED TV 55'",
      "Brand": "ViewMax",
      "Price": 750.00,
      "Stock": 10,
      "ProductType": "Electronics",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "3 years",
      "Weight": "14kg",
      "Dimensions": "124x72x8cm",
      "EntryDate": "2024-01-20",
      "ProductPhoto": "led_tv_55.jpg"
    },
    {
      "ID": 4,
      "WarehouseID": 104,
      "Name": "Wireless Headphones Z3",
      "Brand": "AudioPro",
      "Price": 120.99,
      "Stock": 50,
      "ProductType": "Accessories",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "1 year",
      "Weight": "250g",
      "Dimensions": "18x15x7cm",
      "EntryDate": "2024-02-25",
      "ProductPhoto": "headphones_z3.jpg"
    },
    {
      "ID": 5,
      "WarehouseID": 105,
      "Name": "Gaming Keyboard RGB",
      "Brand": "GamerTech",
      "Price": 89.99,
      "Stock": 20,
      "ProductType": "Accessories",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "2 years",
      "Weight": "1.2kg",
      "Dimensions": "45x18x4cm",
      "EntryDate": "2024-03-05",
      "ProductPhoto": "gaming_keyboard.jpg"
    },
    {
      "ID": 6,
      "WarehouseID": 106,
      "Name": "Bluetooth Speaker M5",
      "Brand": "SoundMax",
      "Price": 65.75,
      "Stock": 40,
      "ProductType": "Audio",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "1 year",
      "Weight": "800g",
      "Dimensions": "20x10x10cm",
      "EntryDate": "2024-02-15",
      "ProductPhoto": "bluetooth_speaker.jpg"
    },
    {
      "ID": 7,
      "WarehouseID": 107,
      "Name": "Mechanical Mouse Pro",
      "Brand": "ClickFast",
      "Price": 45.99,
      "Stock": 60,
      "ProductType": "Accessories",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "2 years",
      "Weight": "300g",
      "Dimensions": "12x6x4cm",
      "EntryDate": "2024-03-12",
      "ProductPhoto": "mechanical_mouse.jpg"
    },
    {
      "ID": 8,
      "WarehouseID": 108,
      "Name": "4K Monitor 27'",
      "Brand": "ScreenTech",
      "Price": 350.00,
      "Stock": 25,
      "ProductType": "Electronics",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "3 years",
      "Weight": "6kg",
      "Dimensions": "61x36x5cm",
      "EntryDate": "2024-01-25",
      "ProductPhoto": "monitor_4k.jpg"
    },
    {
      "ID": 9,
      "WarehouseID": 109,
      "Name": "External SSD 1TB",
      "Brand": "DataStore",
      "Price": 150.49,
      "Stock": 35,
      "ProductType": "Storage",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "5 years",
      "Weight": "400g",
      "Dimensions": "10x6x1cm",
      "EntryDate": "2024-03-10",
      "ProductPhoto": "ssd_1tb.jpg"
    },
    {
      "ID": 10,
      "WarehouseID": 110,
      "Name": "Smartwatch Series 5",
      "Brand": "WearTech",
      "Price": 199.99,
      "Stock": 45,
      "ProductType": "Wearable",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "2 years",
      "Weight": "90g",
      "Dimensions": "4x4x1cm",
      "EntryDate": "2024-02-20",
      "ProductPhoto": "smartwatch_s5.jpg"
    },
    {
      "ID": 1,
      "WarehouseID": 101,
      "Name": "Laptop X200",
      "Brand": "TechBrand",
      "Price": 1200.99,
      "Stock": 15,
      "ProductType": "Electronics",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "2 years",
      "Weight": "2.5kg",
      "Dimensions": "35x24x2cm",
      "EntryDate": "2024-03-15",
      "ProductPhoto": "laptop_x200.jpg"
    },
    {
      "ID": 2,
      "WarehouseID": 102,
      "Name": "Smartphone A9",
      "Brand": "MobileTech",
      "Price": 899.50,
      "Stock": 30,
      "ProductType": "Electronics",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "1 year",
      "Weight": "180g",
      "Dimensions": "15x7x0.8cm",
      "EntryDate": "2024-02-10",
      "ProductPhoto": "smartphone_a9.jpg"
    },
    {
      "ID": 3,
      "WarehouseID": 103,
      "Name": "LED TV 55'",
      "Brand": "ViewMax",
      "Price": 750.00,
      "Stock": 10,
      "ProductType": "Electronics",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "3 years",
      "Weight": "14kg",
      "Dimensions": "124x72x8cm",
      "EntryDate": "2024-01-20",
      "ProductPhoto": "led_tv_55.jpg"
    },
    {
      "ID": 4,
      "WarehouseID": 104,
      "Name": "Wireless Headphones Z3",
      "Brand": "AudioPro",
      "Price": 120.99,
      "Stock": 50,
      "ProductType": "Accessories",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "1 year",
      "Weight": "250g",
      "Dimensions": "18x15x7cm",
      "EntryDate": "2024-02-25",
      "ProductPhoto": "headphones_z3.jpg"
    },
    {
      "ID": 5,
      "WarehouseID": 105,
      "Name": "Gaming Keyboard RGB",
      "Brand": "GamerTech",
      "Price": 89.99,
      "Stock": 20,
      "ProductType": "Accessories",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "2 years",
      "Weight": "1.2kg",
      "Dimensions": "45x18x4cm",
      "EntryDate": "2024-03-05",
      "ProductPhoto": "gaming_keyboard.jpg"
    },
    {
      "ID": 6,
      "WarehouseID": 106,
      "Name": "Bluetooth Speaker M5",
      "Brand": "SoundMax",
      "Price": 65.75,
      "Stock": 40,
      "ProductType": "Audio",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "1 year",
      "Weight": "800g",
      "Dimensions": "20x10x10cm",
      "EntryDate": "2024-02-15",
      "ProductPhoto": "bluetooth_speaker.jpg"
    },
    {
      "ID": 7,
      "WarehouseID": 107,
      "Name": "Mechanical Mouse Pro",
      "Brand": "ClickFast",
      "Price": 45.99,
      "Stock": 60,
      "ProductType": "Accessories",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "2 years",
      "Weight": "300g",
      "Dimensions": "12x6x4cm",
      "EntryDate": "2024-03-12",
      "ProductPhoto": "mechanical_mouse.jpg"
    },
    {
      "ID": 8,
      "WarehouseID": 108,
      "Name": "4K Monitor 27'",
      "Brand": "ScreenTech",
      "Price": 350.00,
      "Stock": 25,
      "ProductType": "Electronics",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "3 years",
      "Weight": "6kg",
      "Dimensions": "61x36x5cm",
      "EntryDate": "2024-01-25",
      "ProductPhoto": "monitor_4k.jpg"
    },
    {
      "ID": 9,
      "WarehouseID": 109,
      "Name": "External SSD 1TB",
      "Brand": "DataStore",
      "Price": 150.49,
      "Stock": 35,
      "ProductType": "Storage",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "5 years",
      "Weight": "400g",
      "Dimensions": "10x6x1cm",
      "EntryDate": "2024-03-10",
      "ProductPhoto": "ssd_1tb.jpg"
    },
    {
      "ID": 10,
      "WarehouseID": 110,
      "Name": "Smartwatch Series 5",
      "Brand": "WearTech",
      "Price": 199.99,
      "Stock": 45,
      "ProductType": "Wearable",
      "ExpirationDate": "N/A",
      "WarrantyPerios": "2 years",
      "Weight": "90g",
      "Dimensions": "4x4x1cm",
      "EntryDate": "2024-02-20",
      "ProductPhoto": "smartwatch_s5.jpg"
    },
  ];

}
