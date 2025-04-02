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
}  