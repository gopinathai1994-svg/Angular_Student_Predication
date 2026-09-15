import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { StudentService } from '../../student';

@Component({
  imports: [BaseChartDirective, CommonModule, MatIconModule, MatDialogModule],
  selector: 'app-chart-popup',
  styleUrl: './chart-popup.css',
  templateUrl: './chart-popup.html',
})
export class ChartPopup {
  chartTitle = '';

  chartType: ChartType = 'pie';

  chartData: ChartData<'pie' | 'bar'> = {
    labels: [],
    datasets: [],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  constructor(
    private dialogRef: MatDialogRef<ChartPopup>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: 'enrollment' | 'attendance' | 'marks';
    },
    private studentService: StudentService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loadChart(data.type);
  }

  loadChart(type: 'enrollment' | 'attendance' | 'marks'): void {
    switch (type) {
      case 'enrollment':
        let data = {
          type: 'enrollment',
        };
        this.studentService.getEnrollmentChart(data).subscribe((response: any) => {
          if (response && response.length > 0) {
            this.loadEnrollmentChart(response);
          }
        });

        break;

      case 'attendance':
        let attendance = {
          type: 'attendance',
        };
        this.studentService.getEnrollmentChart(attendance).subscribe((response: any) => {
          if (response && response.length > 0) {
            this.loadAttendanceChart(response);
          }
        });
        break;

      case 'marks':
         let mark = {
          type: 'marks',
        };
        this.studentService.getEnrollmentChart(mark).subscribe((response: any) => {
          if (response && response.length > 0) {
            this.loadMarksChart(response);
          }
        });
        
        break;
    }
  }

  // -----------------------------------
  // TOTAL ENROLLMENT
  // -----------------------------------

  loadEnrollmentChart(response: any[]): void {
    this.chartTitle = 'Total Enrollment';
    this.chartType = 'pie';

    // 1. Map labels and convert counts explicitly to Numbers
    const chartLabels = response.map((item: any) => `Section ${item._id}`);
    const chartDataValues = response.map((item: any) => Number(item.count));

    console.log('Labels:', chartLabels);
    console.log('Values:', chartDataValues);

    // 2. Bind labels directly into the chartData object structure
    this.chartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartDataValues,
          // Optional: Add distinct background colors for a pie chart
          backgroundColor: ['#6366f1', '#f43f5e', '#c084fc', '#facc15', '#22c55e', '#3b82f6'],
        },
      ],
    };
    this.cdr.detectChanges();
  }

  // -----------------------------------
  // ATTENDANCE
  // -----------------------------------

  loadAttendanceChart(response: any[]): void {
    this.chartTitle = 'Average Attendance';

    this.chartType = 'bar';

    this.chartData = {
      labels: response.map((item: any) => `Section ${item._id}`),

      datasets: [
        {
          label: 'Attendance %',

          data: response.map((item: any) => Number(item.averageAttendance)),
          backgroundColor: ['#6366f1', '#f43f5e', '#c084fc',]
        },
      ],
    };

    this.chartOptions = {
      responsive: true,

      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },

      plugins: {
        legend: {
          display: false,
        },
      },
    };
    this.cdr.detectChanges();
  }

  // -----------------------------------
  // OVERALL MARK AVERAGE
  // -----------------------------------

  loadMarksChart(response:any[]): void {
    this.chartTitle = 'Overall Mark Average';

    this.chartType = 'bar';

    this.chartData = {
      labels: response.map((item: any) => `Section ${item._id}`),

      datasets: [
        {
          label: 'Mark Average',
          data: response.map((item: any) => Number(item.averageMark.toFixed(2))),
          backgroundColor: [ '#facc15', '#22c55e', '#c084fc'],
        },
      ],
    };
    this.cdr.detectChanges();
  }

  close(): any {
    this.dialogRef.close();
  }
}
