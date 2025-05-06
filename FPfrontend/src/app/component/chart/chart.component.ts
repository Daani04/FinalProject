import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { ChartType, ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('chartCanvas', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  @Input() type: ChartType = 'bar';
  @Input() data: ChartConfiguration['data'] | null = null;

  ngAfterViewInit(): void {
    if (this.chartRef && this.data) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      if (this.chart) {
        this.updateChart();
      } else if (this.chartRef && this.data) {
        this.createChart();
      }
    }
  }

  private createChart(): void {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx || !this.data) return;

    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: this.type === 'doughnut' || this.type === 'pie' ? {} : {
          y: { beginAtZero: true },
          x: {}
        },
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          }
        }
      }
    });
  }

  public updateChart(): void {
    if (this.chart && this.data) {
      this.chart.data = this.data;
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
