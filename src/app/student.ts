import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/students';

  // 1. Get All Records
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 2. Add or Update Single Student
  saveStudent(student: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, student);
  }

  // 3. Batch Upload CSV JSON Array
  batchUpload(studentsList: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/batch-upload`, studentsList);
  }

  // 4. Delete Record
  deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  // 5. EnrollmentChart
  getEnrollmentChart(data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enrollmentChart`, data);
  }
}