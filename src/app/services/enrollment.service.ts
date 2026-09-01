import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Enrollment } from '../models/enrollment.model';
import { environment } from '../../environments/environment';

const DEMO_ENROLLMENTS: Enrollment[] = [
  { Id: '101', studentId: 101, studentName: 'Dawit Alemayehu', courseId: 1, courseName: 'Advanced Java Services', status: 'Pending', enrolledAt: '2026-08-20' },
  { Id: '102', studentId: 102, studentName: 'Abebe Kebede', courseId: 3, courseName: 'Database Design', status: 'Pending', enrolledAt: '2026-08-22' },
  { Id: '103', studentId: 103, studentName: 'Liya Kebede', courseId: 2, courseName: 'Angular UI Lab', status: 'Approved', enrolledAt: '2026-08-15' },
  { Id: '104', studentId: 104, studentName: 'Bethlehem Tadesse', courseId: 4, courseName: 'API Security Workshop', status: 'Approved', enrolledAt: '2026-08-18' },
  { Id: '105', studentId: 105, studentName: 'Solomon Tekle', courseId: 1, courseName: 'Advanced Java Services', status: 'Rejected', enrolledAt: '2026-08-10' }
];

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = `${(environment as any).apiUrl || '/api'}/enrollments`;

  getAll(): Observable<Enrollment[]> {
    const saved = localStorage.getItem('tms_enrollments');
    const localData = saved ? JSON.parse(saved) : DEMO_ENROLLMENTS;

    return this.http.get<Enrollment[]>(this.baseUrl).pipe(
      catchError(() => of(localData))
    );
  }

  approve(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/approve`, {}).pipe(
      catchError(() => {
        // Fallback update in localStorage
        const saved = localStorage.getItem('tms_enrollments');
        const list: Enrollment[] = saved ? JSON.parse(saved) : [...DEMO_ENROLLMENTS];
        const updated = list.map(e => (e.Id === id || e.id === id ? { ...e, status: 'Approved' as const } : e));
        localStorage.setItem('tms_enrollments', JSON.stringify(updated));
        return of({ success: true, id, status: 'Approved' });
      })
    );
  }

  saveEnrollment(enrollment: Partial<Enrollment>): Observable<Enrollment> {
    const newEnrollment: Enrollment = {
      Id: `ENR-${Date.now()}`,
      studentId: Number(enrollment.studentId) || Math.floor(Math.random() * 1000),
      studentName: enrollment.studentName || 'Student Demo',
      courseId: Number(enrollment.courseId) || 1,
      courseName: enrollment.courseName || 'Selected Course',
      status: 'Pending',
      enrolledAt: new Date().toISOString().split('T')[0]
    };

    const saved = localStorage.getItem('tms_enrollments');
    const list: Enrollment[] = saved ? JSON.parse(saved) : [...DEMO_ENROLLMENTS];
    list.unshift(newEnrollment);
    localStorage.setItem('tms_enrollments', JSON.stringify(list));

    return of(newEnrollment);
  }
}
