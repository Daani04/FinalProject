import { Component } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';
import { FooterComponent } from "../../component/footer/footer.component";


@Component({
  selector: 'app-graphics',
  imports: [ChartComponent, FooterComponent],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.css'
})
export class GraphicsComponent {

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
  
}
