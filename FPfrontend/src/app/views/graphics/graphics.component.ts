import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';
import { FooterComponent } from "../../component/footer/footer.component";
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { data } from 'jquery';

@Component({
  selector: 'app-graphics',
  imports: [ChartComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.css'
})
export class GraphicsComponent implements OnInit {

  constructor(public service: RequestService) { }

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
        Producto: ${product.Name} (${product.Brand})
        Precio: ${product.Price}
        Stock: ${product.Stock}
        Tipo: ${product.Product_Type}
        Fecha de Entrada: ${product.Entry_Date}
        Fecha de Venta: ${product.Sale_Date} 
        Garantía: ${product.Warranty_Period}
        Cantidad Vendida: ${product.Quantity}
        Expiración: ${product.Expiration_Date}
        Peso: ${product.Weight}
        Dimensiones: ${product.Dimensions}

        -----------------------------------
      `;
    });
    return promptbbdd;
  }

  public deleteCustomGraphic(): void {
    localStorage.removeItem('Customgraphic');
    location.reload();//Recarga la pagina para aplicar los cambios
  }

  //GRAFICOS PREDEFINIDOS
  public barSale = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [{
      label: 'Ventas anuales',
      data: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],  
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


  //Simulacro de conexion a base de datos 
  public products = [
    {
      "ID": 1001,
      "Warehouse_ID": "WH-001",
      "Name": "Ultra HD Smart TV",
      "Brand": "Samsung",
      "Price": "$12,99",
      "Stock": 5,
      "Product_Type": "Electronics",
      "Expiration_Date": "N/A",
      "Warranty_Period": "2 years",
      "Weight": "15.2 kg",
      "Dimensions": "48\" x 28\" x 4\"",
      "Entry_Date": "2023-05-15",
      "Sale_Date": "2021-06-01",  // Agregado
      "Quantity": 5,              // Agregado
      "Product_Photo": "Smart TV"
    },
    {
      "ID": 1002,
      "Warehouse_ID": "WH-002",
      "Name": "Wireless Earbuds",
      "Brand": "Apple",
      "Price": "$199.99",
      "Stock": 120,
      "Product_Type": "Electronics",
      "Expiration_Date": "N/A",
      "Warranty_Period": "1 year",
      "Weight": "0.05 kg",
      "Dimensions": "2.5\" x 2\" x 1\"",
      "Entry_Date": "2023-06-01",
      "Sale_Date": "2022-06-05",  // Agregado
      "Quantity": 4,               // Agregado
      "Product_Photo": "Wireless Earbuds"
    },
    {
      "ID": 1003,
      "Warehouse_ID": "WH-003",
      "Name": "Gaming Laptop",
      "Brand": "Delll",
      "Price": "$1,499.99",
      "Stock": 25,
      "Product_Type": "Electronics",
      "Expiration_Date": "N/A",
      "Warranty_Period": "2 years",
      "Weight": "2.5 kg",
      "Dimensions": "15.6\" x 10\" x 0.7\"",
      "Entry_Date": "2023-07-12",
      "Sale_Date": "2023-07-15",  // Agregado
      "Quantity": 3,              // Agregado
      "Product_Photo": "Gaming Laptop"
    },
    {
      "ID": 1004,
      "Warehouse_ID": "WH-004",
      "Name": "Air Fryer",
      "Brand": "Philips",
      "Price": "$129.99",
      "Stock": 60,
      "Product_Type": "Home Appliances",
      "Expiration_Date": "N/A",
      "Warranty_Period": "100 year",
      "Weight": "4.5 kg",
      "Dimensions": "12\" x 12\" x 14\"",
      "Entry_Date": "2023-08-03",
      "Sale_Date": "2024-08-10",  // Agregado
      "Quantity": 10,              // Agregado
      "Product_Photo": "Air Fryer"
    },
    {
      "ID": 1005,
      "Warehouse_ID": "WH-005",
      "Name": "4K Action Camera",
      "Brand": "GoPro",
      "Price": "$399.99",
      "Stock": 90,
      "Product_Type": "Electronics",
      "Expiration_Date": "N/A",
      "Warranty_Period": "2 years",
      "Weight": "0.4 kg",
      "Dimensions": "3.5\" x 2.5\" x 1.5\"",
      "Entry_Date": "2023-09-20",
      "Sale_Date": "2025-09-25",  // Agregado
      "Quantity": 4,              // Agregado
      "Product_Photo": "Action Camera"
    }
  ];
  
 
}  