import { Component } from '@angular/core';
import { ChartComponent } from '../../component/chart/chart.component';

@Component({
  selector: 'app-home',
  imports: [ChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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

}
