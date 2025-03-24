import { Component } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';


@Component({
  selector: 'app-graphics',
  imports: [ChartComponent],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.css'
})
export class GraphicsComponent {

  // Gráfico de barras
  public barChart = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Ventas',
      data: [10, 20, 15, 30, 25],
      backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple'],
      borderColor: 'black',
      borderWidth: 1
    }]
  };

  // Gráfico de líneas
  public lineChart = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Crecimiento',
      data: [5, 15, 10, 20, 18],
      borderColor: 'blue',
      borderWidth: 2,
      fill: false
    }]
  };

  // **Nuevo** Gráfico de pastel
  public pieChart = {
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
      label: 'Distribución de Ventas',
      data: [40, 30, 30],
      backgroundColor: ['red', 'blue', 'yellow']
    }]
  };

  // **Nuevo** Gráfico de área
  public areaChart = {  
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Ingresos',
      data: [12, 19, 3, 5, 2],
      borderColor: 'green',
      backgroundColor: 'rgba(0, 255, 0, 0.3)',
      borderWidth: 2,
      fill: true
    }]
  };

  // **Nuevo** Gráfico de radar
  public radarChart = {  
    labels: ['Calidad', 'Precio', 'Atención', 'Entrega', 'Satisfacción'],
    datasets: [{
      label: 'Opiniones de clientes',
      data: [8, 7, 9, 6, 8],
      borderColor: 'purple',
      backgroundColor: 'rgba(128, 0, 128, 0.3)',
      borderWidth: 2
    }]
  };

}
