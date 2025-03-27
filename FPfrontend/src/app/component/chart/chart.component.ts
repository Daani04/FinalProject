import { Component, ViewChild, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { ChartType } from 'chart.js';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  
  //Despues se llama en el HTML, y dentro de este se isertan los graficos que se dibujaran en la etiqueta <canvas>
  @ViewChild('chartCanvas', { static: false }) chartRef!: ElementRef;
  private chart!: Chart;

  @Input() type: ChartType = 'bar'; 
  @Input() data: any; 

  // ngAfterViewInit, parecido al ngOnInit, se ejecuta sin tener que llamarlo, pero espera a que el <canvas> este listo antes de intentar inicializar los graficos
  ngAfterViewInit(): void {
    if (this.chartRef) {
      this.chart = new Chart(this.chartRef.nativeElement.getContext('2d'), {
        type: this.type,  
        data: this.data, 
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: this.type === 'doughnut' || this.type === 'pie' ? {} : { 
            //Graficos de barra y linea
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(149, 146, 146, 0.5)',  
              },
            },
            x: {
              grid: {
                color: 'rgba(149, 146, 146, 0.5)',  
              },
            },
            // Grafico tipo tipo Radar
            r: {
              grid: {
                color: 'rgb(181, 177, 177)',  
                lineWidth: 1,  
              },
              angleLines: {
                color: 'rgb(181, 177, 177)',  
                lineWidth: 1,  
              },
              ticks: {
                display: false,  
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white'  //Color del texto
              }
            }
          }
        },
      });
    }
  }
  
  

  //Sirve para que si no estamos usando los graficos(por ejemplo cambiamos de pagina) se eliminen lo graficos de chart para que deje de ocupar memoria
  //Se ejecuta automaticamente apra hacer la comprobacion 
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}