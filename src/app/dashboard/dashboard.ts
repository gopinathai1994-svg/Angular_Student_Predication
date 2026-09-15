import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudentService } from '../student';
import { StudentDialogComponent } from '../student-dialog/student-dialog.component';
import * as Papa from 'papaparse';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
Chart.register(...registerables);
import { ChartPopup } from './chart-popup/chart-popup';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['Roll_No', 'Name', 'Section', 'Attendance', 'Monthly_Mark', 'Performance', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.studentService.getStudents().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // 1. Search Filter Logic
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // 2. CSV Bulk Upload
  onFileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData: any[] = result.data.map((item: any) => ({
            Roll_No: item.Roll_No,
            Name: item.Name,
            Section: item.Section,
            Attendance: Number(item.Attendance),
            Monthly_Mark: Number(item.Monthly_Mark),
            Parent_Name: item.Parent_Name,
            Parent_Email: item.Parent_Email
          }));

          this.studentService.batchUpload(parsedData).subscribe(() => this.fetchStudents());
        }
      });
    }
  }

  // 3. Open Dialog for Add / Edit / View
  openDialog(mode: 'add' | 'edit' | 'view', student?: any): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '650px',
      data: { mode, student },
      panelClass: 'saas-dialog-container',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (mode === 'add') {
          this.studentService.saveStudent(result).subscribe(() => this.fetchStudents());
        } else if (mode === 'edit' && student?._id) {
          this.studentService.saveStudent({ ...result, _id: student._id }).subscribe(() => this.fetchStudents());
        }
      }
    });
  }

  // 4. Delete Record
  deleteStudent(id: string): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.studentService.deleteStudent(id).subscribe(() => this.fetchStudents());
    }
  }

  // Get dynamic Average Attendance
  get avgAttendance(): string {
    const data = this.dataSource.data;
    if (!data || data.length === 0) return '0%';
    const total = data.reduce((acc, curr) => acc + (Number(curr.Attendance) || 0), 0);
    const avg = total / data.length;
    return avg.toFixed(1) + '%';
  }

  // Get dynamic Overall Mark Average
  get overallMarkAvg(): string {
    const data = this.dataSource.data;
    if (!data || data.length === 0) return '0';
    const total = data.reduce((acc, curr) => acc + (Number(curr.Monthly_Mark) || 0), 0);
    const avg = total / data.length;
    return avg.toFixed(1);
  }

   openChart(type: 'enrollment' | 'attendance' | 'marks'): void {

    this.dialog.open(ChartPopup, {
      width: '850px',
      maxWidth: '95vw',
      data: {
        type
      },
      panelClass: 'dashboard-chart-dialog'
    });

  }
}