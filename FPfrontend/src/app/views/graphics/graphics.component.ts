import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../component/footer/footer.component";
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { data } from 'jquery';
import { ProductAllData, ProductSold } from '../../models/response.interface';
import { ViewChild } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';
import { NgClass, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-graphics',
  imports: [ChartComponent, FooterComponent, ReactiveFormsModule, NgStyle, RouterLink],
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

  public saleProductsForWeek: number[] = []
  public entrateProductsForMonth: number[] = [];

  public moreSoldProductsName: string[] = [];
  public moreSoldProductsQuantity: number[] = [];

  public grossIncome: number[] = [];
  public netIncome: number[] = [];//lfjkd

  public cont1: number = 0;
  public cont2: number = 0;
  public cont3: number = 0;

  public contButton: number = 0;

  public response: string = '';

  public loading: boolean = false;

  public loadingAllPage: boolean = false;
  public changueScreen: boolean = false;

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
  }

  public onSubmitGraphics(): void {
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
        this.getProductsForMonth();
        this.checkProductsData();
        this.getMoreSoldProducts();
        this.getProductsForWeek();
      },
      error: (error) => {
        console.error('Error al sacar los productos:', error);
        this.checkProductsData();

      }
    });
  }
  
  public reloadGraphics(): void {
    if (this.saleProductsForMonth.length > 0) {
        this.barSale.datasets[0].data = this.saleProductsForMonth;
    }
 
    if (this.moreSoldProductsName.length > 0 && this.moreSoldProductsQuantity.length > 0) {
        this.circularMostSale.labels = this.moreSoldProductsName;
        this.circularMostSale.datasets[0].data = this.moreSoldProductsQuantity;
    }
 
    if (this.saleProductsForWeek.length > 0) {
        this.lineSale.datasets[0].data = this.saleProductsForWeek;
    }
 
    if (this.saleProductsForMonth.length > 0) {
        this.lineExitProducts.datasets[0].data = this.saleProductsForMonth;
    }
 
    if (this.entrateProductsForMonth.length > 0) {
        this.lineEntrateProducts.datasets[0].data = this.entrateProductsForMonth;
    }

    this.lineGrossProfits.datasets[0].data = this.grossIncome;
    this.lineNetProfits.datasets[0].data = this.netIncome;

    
 
    if (this.chartComponent) {
        this.chartComponent.updateChart();
    }
 }
 

  public getProductsForMonth(): void { 
    let actualYear = new Date().getFullYear();
    let salesForMonth = new Array(12).fill(0);
    let stockForMonth = new Array(12).fill(0);
    
    let grossIncomeMony = new Array(12).fill(0);
    let netIncomeMoney = new Array(12).fill(0);
    
    // Ventas de cada mes
    for (let i = 0; i < this.productsSold.length; i++) {
      let fecha = new Date(this.productsSold[i].sale_date.replace(" ", "T"));
      if (fecha.getFullYear() === actualYear) {
        let month = fecha.getMonth();
        salesForMonth[month] += this.productsSoldQuantity[i] || 0;
      }
    }
  
    for (let i = 0; i < this.products.length; i++) {
      let product = this.products[i];
      let month = new Date(product.entry_date).getMonth(); 
      stockForMonth[month] += product.stock; 
      //Se han intercambiado el valro de los precios de compra y venta po que los cogia al reves del a base de datos 
      grossIncomeMony[month] += product.purchase_price;
      netIncomeMoney[month] += product.price
    }
  
    let unsoldProductsForMonth = stockForMonth.map((stock, index) => stock - salesForMonth[index]);
    
    this.saleProductsForMonth = salesForMonth;
    this.entrateProductsForMonth = unsoldProductsForMonth; 

    let estimatedBenefit = grossIncomeMony.map((gross, i) => netIncomeMoney[i] - gross);

    this.grossIncome = grossIncomeMony;
    this.netIncome = estimatedBenefit;


    this.reloadGraphics();
    console.log('Productos vendidos cada mes:', stockForMonth);
    console.log('COMPRA:', this.grossIncome);
    console.log('VENTA: ',  netIncomeMoney);
    console.log('BENEFICIO: ',  this.netIncome);

  }
  
  
  public getProductsForWeek(): void {
    let actualYear = new Date().getFullYear();
    let currentWeekNumber = this.getWeekNumber(new Date());
    let salesForWeek = new Array(7).fill(0); // Inicializar array de 7 días
  
    for (let i = 0; i < this.productsSold.length; i++) {
      let fecha = new Date(this.productsSold[i].sale_date.replace(" ", "T"));
      if (fecha.getFullYear() === actualYear && this.getWeekNumber(fecha) === currentWeekNumber) {
        let dayOfWeek = fecha.getDay(); 
        let correctedDayOfWeek = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;  //Ajuste para que las posiciones de los dias sean correctas
        salesForWeek[correctedDayOfWeek] += this.productsSoldQuantity[i] || 0;      }
    }
  
    this.saleProductsForWeek = salesForWeek; 
    //console.log('Ventas semanales', this.saleProductsForWeek);
    this.reloadGraphics();
  }
  
  private getWeekNumber(date: Date): number {
    let startDate = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.valueOf() - startDate.valueOf()) / 86400000 + 1) / 7);
  }

  public getMoreSoldProducts(): void {  
    for (let i = 0; i < this.productsSold.length; i++) {
      let quantity = this.productsSold[i].quantity;
      let name = this.productsSold[i].name;
  
      if (this.moreSoldProductsQuantity.length < 4) {
        this.moreSoldProductsQuantity.push(quantity);
        this.moreSoldProductsName.push(name);
      } else {
        let minIndex = 0;
        for (let j = 1; j < this.moreSoldProductsQuantity.length; j++) {
          if (this.moreSoldProductsQuantity[j] < this.moreSoldProductsQuantity[minIndex]) {
            minIndex = j;
          }
        }
  
        // Si el nuevo producto tiene mayor cantidad, lo reemplazamos
        if (quantity > this.moreSoldProductsQuantity[minIndex]) {
          this.moreSoldProductsQuantity[minIndex] = quantity;
          this.moreSoldProductsName[minIndex] = name;
        }
      }
    }
    this.reloadGraphics();
    //console.log('Cantidad', this.moreSoldProductsQuantity);
    //console.log('MoreSoldProductsName', this.moreSoldProductsName);
  }
  
  
  public checkProductsData():void {
    if (this.products.length > 0 || this.productsSold.length > 0) {
      this.loadingAllPage = false; 
      this.changueScreen = false; 
    } else {
      this.loadingAllPage = true; 
      this.changueScreen = true; 
      console.log('No hay datos disponibles para mostrar');
    }
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
  
  public lineSale: any = {
    labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    datasets: [
      {
        label: 'Ventas semanales',
        data: [],
        borderColor: '#8F5B8C',
        fill: false,
        stepped: true,
      }
    ]
  };
  
  public circularMostSale: any = {
    labels: [],
    datasets: [{
      label: 'Distribución de Ventas',
      data: [],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94'] 
    }]
  };
  
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
  
  public lineGrossProfits: any  = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Ingresos brutos',
      data: [],  
      borderColor: '#6F4D94', 
      backgroundColor: 'rgba(145, 112, 188, 0.3)', 
      borderWidth: 2,
      fill: true
    }]
  };
  
  public lineNetProfits: any  = {  
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
  public stockAvailable: any = {  
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      data: [30, 40, 30],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA'], 
    }]
  };
  
  public discountsApplied: any = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Descuentos aplicados',
      data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],  
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94', '#7A6DA7', '#9A8BCA'], 
      borderColor: 'rgb(159, 94, 148)', 
      borderWidth: 2
    }]
  };
  
  public monthlySalesComparison: any = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Comparación de ventas por mes',
      data: [200, 250, 300, 350, 700, 450, 500, 550, 600, 650, 700, 750],  
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#6F4D94', '#7A6DA7'], 
      borderColor: 'rgb(159, 94, 148)',
      borderWidth: 2
    }]
  };
  
  public productReturns: any = {  
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      data: [100, 150, 200],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#7A6DA7', '#9A8BCA'], 
    }]
  };
  
  public categorySales: any = {  
    labels: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar'],
    datasets: [{
      data: [5000, 3000, 4000, 2000],
      backgroundColor: ['#6F4D94', '#7A6DA7', '#9A8BCA', '#7A6DA7', '#9A8BCA'], 
    }]
  };
  
  public productCosts: any = {  
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