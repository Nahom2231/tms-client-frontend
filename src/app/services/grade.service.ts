import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface GradePayload {
  studentId: number;
  courseId: number;
  score: number;
  letterGrade?: string;
  comments?: string;
}

export interface GradeRecord extends GradePayload {
  id: string;
  submittedAt: string;
  studentName?: string;
  courseTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private http = inject(HttpClient);

  calculateLetter(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  postGrade(payload: GradePayload): Observable<{ id: string; success: boolean }> {
    const recordId = `GRD-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: GradeRecord = {
      ...payload,
      id: recordId,
      letterGrade: payload.letterGrade || this.calculateLetter(payload.score),
      submittedAt: new Date().toLocaleDateString()
    };

    // Store in localStorage for persistence
    const existing = localStorage.getItem('tms_grades');
    const grades: GradeRecord[] = existing ? JSON.parse(existing) : [];
    grades.unshift(record);
    localStorage.setItem('tms_grades', JSON.stringify(grades));

    return this.http.post<{ id: string; success: boolean }>('/api/grades', payload).pipe(
      catchError(() => of({ id: recordId, success: true }))
    );
  }

  getRecentGrades(): Observable<GradeRecord[]> {
    const existing = localStorage.getItem('tms_grades');
    const defaultGrades: GradeRecord[] = [
      { id: 'GRD-8841', studentId: 101, studentName: 'Dawit Alemayehu', courseId: 1, courseTitle: 'Advanced Java Services', score: 92, letterGrade: 'A+', submittedAt: '2026-08-28' },
      { id: 'GRD-7712', studentId: 102, studentName: 'Abebe Kebede', courseId: 3, courseTitle: 'Database Design', score: 84, letterGrade: 'B+', submittedAt: '2026-08-25' },
      { id: 'GRD-9034', studentId: 103, studentName: 'Liya Kebede', courseId: 2, courseTitle: 'Angular UI Lab', score: 96, letterGrade: 'A+', submittedAt: '2026-08-29' }
    ];

    return of(existing ? JSON.parse(existing) : defaultGrades);
  }
}
