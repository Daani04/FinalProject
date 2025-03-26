import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';
import { FooterComponent } from "../../component/footer/footer.component";
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-graphics',
  imports: [ChartComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.css'
})
export class GraphicsComponent implements OnInit {


  public cont1: number = 0;
  public cont2: number = 0;
  public cont3: number = 0;

  public contButton: number = 0;

  public modifyContButton(): void {
    if (this.contButton === 0) {
      this.contButton = 1;
    } else {
      this.contButton = 0;
    }
  }

  reactiveForm = new FormGroup({
    check1: new FormControl(false),
    check2: new FormControl(false),
    check3: new FormControl(false)
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
  
  public barSale = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Ventas anuales',
      data: [10, 20, 15, 30, 25],
      backgroundColor: ['#D1B07B', '#A67058', '#D1B07B', '#A67058', '#D1B07B'], 
      borderColor: '#3E2A47', 
      borderWidth: 1
    }]
  };
  
  public lineSale = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
    datasets: [
      {
        label: 'Ventas semanales',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#D1B07B',
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
      backgroundColor: ['#D1B07B', '#A67058', '#D1B07B'] 
    }]
  };
  
  public lineExitProducts = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Entrada de productos',
      data: [5, 15, 10, 20, 18],
      borderColor: '#A67058', 
      borderWidth: 2,
      fill: false
    }]
  };
  
  public lineEntrateProducts = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Salida de productos',
      data: [5, 15, 10, 20, 18],
      borderColor: '#D1B07B', 
      borderWidth: 2,
      fill: false
    }]
  };
  
  public lineGrossProfits  = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Ingresos brutos',
      data: [12, 19, 3, 5, 2],
      borderColor: '#A67058', 
      backgroundColor: 'rgba(166, 112, 88, 0.3)', 
      borderWidth: 2,
      fill: true
    }]
  };
  
  public lineNetProfits  = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Ingresos netos',
      data: [6, 8, 3, 9, 2],
      borderColor: '#D1B07B', 
      backgroundColor: 'rgba(209, 176, 123, 0.3)', 
      borderWidth: 2,
      fill: true
    }]
  };

  //GRAFICOS EXTRA
  public stockAvailable = {  
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      data: [30, 40, 30],
      backgroundColor: ['#D1B07B', '#A67058', '#D1B07B', '#A67058', '#D1B07B'], 
    }]
  };

  public discountsApplied = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Descuentos aplicados',
      data: [200, 250, 300, 350, 400],
      backgroundColor: ['#D1B07B', '#A67058', '#D1B07B', '#A67058', '#D1B07B'], 
      borderColor: 'rgb(117, 71, 24)',
      borderWidth: 2
    }]
  };

  public monthlySalesComparison = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Comparación de ventas por mes',
      data: [3000, 4000, 5000, 6000, 7000],
      backgroundColor: ['#D1B07B', '#A67058', '#D1B07B', '#A67058', '#D1B07B'], 
      borderColor: 'rgb(117, 71, 24)',
      borderWidth: 2
    }]
  };

  public productReturns = {  
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      data: [100, 150, 200],
      backgroundColor: ['#D1B07B', '#A67058', '#D1B07B', '#A67058', '#D1B07B'], 
    }]
  };

  public categorySales = {  
    labels: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar'],
    datasets: [{
      data: [5000, 3000, 4000, 2000],
      backgroundColor: ['#D1B07B', '#A67058', '#D1B07B', '#A67058', '#D1B07B'], 
    }]
  };

  public productCosts = {  
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      label: 'Costos de productos',
      data: [150, 200, 250],
      backgroundColor: ['#D1B07B', '#A67058', '#D1B07B', '#A67058', '#D1B07B'], 
      borderColor: 'rgb(117, 71, 24)',
      borderWidth: 2
    }]
  };
  
}
