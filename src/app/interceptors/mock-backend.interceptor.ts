import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { INITIAL_COURSES } from '../services/course';

const DEMO_ENROLLMENTS = [
  { Id: '101', studentId: 101, studentName: 'Dawit Alemayehu', courseId: 1, courseName: 'Advanced Java Services', status: 'Pending', enrolledAt: '2026-08-20' },
  { Id: '102', studentId: 102, studentName: 'Abebe Kebede', courseId: 3, courseName: 'Database Design', status: 'Pending', enrolledAt: '2026-08-22' },
  { Id: '103', studentId: 103, studentName: 'Liya Kebede', courseId: 2, courseName: 'Angular UI Lab', status: 'Approved', enrolledAt: '2026-08-15' },
  { Id: '104', studentId: 104, studentName: 'Bethlehem Tadesse', courseId: 4, courseName: 'API Security Workshop', status: 'Approved', enrolledAt: '2026-08-18' }
];

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.toLowerCase();

  // Intercept API calls to prevent 404 console errors when backend server is offline
  if (url.includes('/courses') || url.includes('/enrollments') || url.includes('/grades') || url.includes('/auth/login')) {
    
    // GET /courses
    if (url.includes('/courses') && req.method === 'GET') {
      const saved = localStorage.getItem('tms_courses');
      const items = saved ? JSON.parse(saved) : INITIAL_COURSES;
      return of(new HttpResponse({
        status: 200,
        body: { items, totalCount: items.length, page: 1, pageSize: 50, totalPages: 1, hasPrevious: false, hasNext: false }
      }));
    }

    // GET /enrollments
    if (url.includes('/enrollments') && req.method === 'GET') {
      const saved = localStorage.getItem('tms_enrollments');
      const items = saved ? JSON.parse(saved) : DEMO_ENROLLMENTS;
      return of(new HttpResponse({ status: 200, body: items }));
    }

    // POST /enrollments/{id}/approve or /enrollments
    if (url.includes('/enrollments') && req.method === 'POST') {
      return of(new HttpResponse({ status: 200, body: { success: true } }));
    }

    // POST /grades
    if (url.includes('/grades') && req.method === 'POST') {
      return of(new HttpResponse({ status: 200, body: { id: `GRD-${Math.floor(1000 + Math.random() * 9000)}`, success: true } }));
    }

    // POST /auth/login
    if (url.includes('/auth/login') && req.method === 'POST') {
      return of(new HttpResponse({ status: 200, body: { accessToken: 'mock-token', refreshToken: 'mock-refresh' } }));
    }
  }

  return next(req);
};
