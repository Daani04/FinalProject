import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../component/footer/footer.component";
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { data } from 'jquery';
import { ProductAllData, ProductSold } from '../../models/response.interface';
import { ViewChild } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';

@Component({
  selector: 'app-graphics',
  imports: [ChartComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.css'
})
export class GraphicsComponent implements OnInit {

  @ViewChild('chartComponent') chartComponent!: ChartComponent;

  constructor(public service: RequestService) { }

  public apiProductsUrl: string = "http://localhost:8000/api/data";
  public apiSalesUrl: string = "http://localhost:8000/api/sales";

  public products: ProductAllData [] = [];
  public productsSold: ProductSold [] = [];

  public productsSoldQuantity: number[] = [];
  public saleProductsForMonth: number[] = [];

  public cont1: number = 0;
  public cont2: number = 0;
  public cont3: number = 0;

  public contButton: number = 0;

  public response: string = '';

  public loading: boolean = false;

  public showFormIa: boolean = false;
  public GraphicIA: any;
  public dataNewGraphics: string[] = [];

  public modifyContButton(): void {
    if (this.contButton === 0) {
      this.contButton = 1;
    } else {
      this.contButton = 0;
    }
    this.showFormIa = false;
  }

  reactiveForm = new FormGroup({
    check1: new FormControl(false),
    check2: new FormControl(false),
    check3: new FormControl(false)
  });

  reactiveFormGraphics = new FormGroup({
    graphicInstructions: new FormControl(''),
  });

  ngOnInit(): void {
    this.cont1 = Number(localStorage.getItem('cont1')) || 0;
    this.cont2 = Number(localStorage.getItem('cont2')) || 0;
    this.cont3 = Number(localStorage.getItem('cont3')) || 0;

    // Si contX esta marcado es true y el ckeckbox saldra marcado
    this.reactiveForm.setValue({
      check1: this.cont1 === 1,
      check2: this.cont2 === 1,
      check3: this.cont3 === 1
    });
    this.checkAndLoadGraphics();
    this.checkProducts();
    this.getProductsSold();

    /*
    let dataNewGraphics: number[] = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
    this.barSale.datasets[0].data = dataNewGraphics;
    */
  }

  onSubmitGraphics(): void {
    console.log( this.reactiveFormGraphics.value.graphicInstructions);
    this.createGraphics(this.reactiveFormGraphics.value.graphicInstructions);
  }

  public onSubmit(): void {
    if (this.reactiveForm.value.check1 !== undefined) {
      let cont1Local = this.reactiveForm.value.check1 ? 1 : 0;
      localStorage.setItem('cont1', cont1Local.toString());
      this.cont1 = cont1Local;
    }

    if (this.reactiveForm.value.check2 !== undefined) {
      let cont2Local = this.reactiveForm.value.check2 ? 1 : 0;
      localStorage.setItem('cont2', cont2Local.toString());
      this.cont2 = cont2Local;
    }

    if (this.reactiveForm.value.check3 !== undefined) {
      let cont3Local = this.reactiveForm.value.check3 ? 1 : 0;
      localStorage.setItem('cont3', cont3Local.toString());
      this.cont3 = cont3Local;
    }

    console.log(this.reactiveForm.value);
    console.log(this.cont1);
    console.log(this.cont2);
    console.log(this.cont3);
  }

  public showNewGraphicsIAForm(): void {
    this.showFormIa = true
  }

  
  createGraphics(prompt: any) {
    let promptbbdd = this.createPromptFromProducts();
    this.loading = true; 
    this.dataNewGraphics = []; 
    this.service.createGraphics(prompt, promptbbdd).subscribe(
      (res) => {
        this.response = res.choices[0].message.content;
        let separateData = this.response.split('!'); // Separar la respuesta por "!".
        separateData.forEach((item: string) => {
          if (item.trim()) {  
            this.dataNewGraphics.push(item.trim()); 
          }
        });

      localStorage.setItem(`Customgraphic`, JSON.stringify(this.dataNewGraphics));
      
      console.log('Respuesta:', this.response);
      this.generateGraphics();
      this.loading = false;  
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;  
      }
    );
  }

  public checkAndLoadGraphics(): void {
    const localStorageData = localStorage.getItem('Customgraphic');
    this.dataNewGraphics = localStorageData ? JSON.parse(localStorageData) : [];
  
    if (this.dataNewGraphics.length >= 3) {
      this.generateGraphics();
    }
  }
  
  public generateGraphics(): void {
    if (this.dataNewGraphics.length > 0) {
      let allColors: string[] = ['#5B3F7C', '#6F4D94', '#7A6DA7', '#8A7DBD', '#9A8BCA', '#8A7DBD', '#9A8BCA',
        '#5B3F7C', '#6F4D94', '#7A6DA7', '#8A7DBD', '#9A8BCA', '#8A7DBD', '#9A8BCA',
        '#5B3F7C', '#6F4D94', '#7A6DA7', '#8A7DBD', '#9A8BCA', '#8A7DBD', '#9A8BCA'
      ];
      let necessaryColors: string[] = [];
      let parsedLabels: string[] = [];
      let parsedData: string[] = [];

      let labelsSplit = this.dataNewGraphics[0].split(' ');
      let dataSplit = this.dataNewGraphics[2].split(' ');

      for (let i = 0; i < dataSplit.length; i++) {
        necessaryColors.push(allColors[i]);  
      }
      
      for (let i = 0; i < labelsSplit.length; i++) {
        let label = labelsSplit[i].trim();
          parsedLabels.push(label);
        
      }

      for (let i = 0; i < dataSplit.length; i++) {
        let label = dataSplit[i].trim();
          parsedData.push(label);
      }
  
      this.GraphicIA = {
        labels: parsedLabels,
        datasets: [{
          label: this.dataNewGraphics[1],
          data: parsedData, 
          backgroundColor: necessaryColors,
          borderColor: '#5B3F7C',
          borderWidth: 1
        }]
      };
    }
  }

  public createPromptFromProducts(): string {
    let promptbbdd = '';
    this.products.forEach(product => {
      promptbbdd += `
        Producto: ${product.name} (${product.brand})
        Precio Venta: ${product.price}
        Precio Compra: ${product.purchase_price}
        Stock: ${product.stock}
        Tipo: ${product.product_type}
        Fecha de Entrada: ${product.entry_date}
        Fecha de caducidad: ${product.expiration_date} 
        Expiración: ${product.expiration_date}
        IdAlmacen: ${product.warehouse}
        -----------------------------------
      `;
    });
    return promptbbdd;
  }

  public deleteCustomGraphic(): void {
    localStorage.removeItem('Customgraphic');
    location.reload();//Recarga la pagina para aplicar los cambios
  }

  public checkProducts(): void {
    let userIdString = localStorage.getItem('userId');
  
    if (!userIdString) {
      console.error('Error: No se encontró userId en localStorage');
      return;
    }
  
    let userId = parseInt(userIdString, 10);
  
    let apiUrl = `${this.apiProductsUrl}/user/${userId}`;
  
    this.service.takeProducts(apiUrl).subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (error) => {
        console.error('Error al sacar los productos:', error);
      }
    });
  }

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
        console.log('Productos vendidos:', this.productsSoldQuantity);  
        this.getProductsForMonth();
      },
      error: (error) => {
        console.error('Error al sacar los productos:', error);
      }
    });
  }
  
  public reloadGraphics(): void {
    if (this.productsSoldQuantity.length > 0) {

      this.barSale.datasets[0].data = this.saleProductsForMonth;
  
      if (this.chartComponent) {
        this.chartComponent.updateChart();  // llama al método del componente hijo
        console.log('Gráfico actualizado');
      }
    } else {
      console.log('No hay datos disponibles para actualizar el gráfico');
    }
  }

  public getProductsForMonth(): void {
    let actualYear = new Date().getFullYear(); // Año actual
    let salesForMonth: number[] = new Array(12).fill(0); // Inicializar array con 12 ceros
  
    for (let i = 0; i < this.productsSold.length; i++) {
      let formattedDate = this.productsSold[i].sale_date.replace(" ", "T"); //Remplaza el espacio por una T y se asegura que Date funcione bien
      let fecha = new Date(formattedDate); //Combierte la fecha a un objeto Date lo que permite sacar datos por separado como el mes 
      let productYear = fecha.getFullYear();
  
      if (productYear === actualYear) {
        let mes = fecha.getMonth(); 
        let quantitySold = this.productsSoldQuantity[i] || 0;
        salesForMonth[mes] += quantitySold; 
      }
    }
    this.saleProductsForMonth = salesForMonth;
    this.reloadGraphics(); 
    console.log('Ventas totales por mes (enero a diciembre):', this.saleProductsForMonth);
  }

  public getExpensiveProducts(): void {
    
  }
  
  //GRAFICOS PREDEFINIDOS
  public barSale: any = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Ventas anuales',
      data: [],  
      backgroundColor: ['#5B3F7C', '#6F4D94', '#7A6DA7', '#8A7DBD', '#9A8BCA'],
      borderColor: '#5B3F7C', 
      borderWidth: 1
    }]
  };
  
  public lineSale = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
    datasets: [
      {
        label: 'Ventas semanales',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#8F5B8C',
        fill: false,
        stepped: true,
      }
    ]
  };
  
  public circularMostSale = {
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      label: 'Distribución de Ventas',
      data: [40, 30, 30],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA'] 
    }]
  };
  
  public lineExitProducts = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Entrada de productos',
      data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],  
      borderColor: '#6F4D94', 
      borderWidth: 2,
      fill: false
    }]
  };
  
  public lineEntrateProducts = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Salida de productos',
      data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],  
      borderColor: '#9A8BCA', 
      borderWidth: 2,
      fill: false
    }]
  };
  
  public lineGrossProfits  = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Ingresos brutos',
      data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],  
      borderColor: '#6F4D94', 
      backgroundColor: 'rgba(145, 112, 188, 0.3)', 
      borderWidth: 2,
      fill: true
    }]
  };
  
  public lineNetProfits  = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Ingresos netos',
      data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],  
      borderColor: '#8F5B8C', 
      backgroundColor: 'rgba(159, 94, 148, 0.3)', 
      borderWidth: 2,
      fill: true
    }]
  };
  
  //GRAFICOS EXTRA
  public stockAvailable = {  
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      data: [30, 40, 30],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA'], 
    }]
  };
  
  public discountsApplied = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Descuentos aplicados',
      data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],  
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94', '#7A6DA7', '#9A8BCA'], 
      borderColor: 'rgb(159, 94, 148)', 
      borderWidth: 2
    }]
  };
  
  public monthlySalesComparison = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Comparación de ventas por mes',
      data: [200, 250, 300, 350, 700, 450, 500, 550, 600, 650, 700, 750],  
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94', '#7A6DA7'], 
      borderColor: 'rgb(159, 94, 148)',
      borderWidth: 2
    }]
  };
  
  public productReturns = {  
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      data: [100, 150, 200],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#7A6DA7', '#9A8BCA'], 
    }]
  };
  
  public categorySales = {  
    labels: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar'],
    datasets: [{
      data: [5000, 3000, 4000, 2000],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#7A6DA7', '#9A8BCA'], 
    }]
  };
  
  public productCosts = {  
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      label: 'Costos de productos',
      data: [150, 200, 250],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#7A6DA7', '#9A8BCA'], 
      borderColor: 'rgb(159, 94, 148)',
      borderWidth: 2
    }]
  };
 
}  