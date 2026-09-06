import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { INITIAL_COURSES } from '../services/course';

const DEMO_ENROLLMENTS = [
  { Id: '101', studentId: 101, studentName: 'Dawit Alemayehu', courseId: 1, courseName: 'Advanced Java Services', status: 'Pending', enrolledAt: '2026-08-20' },
  { Id: '102', studentId: 102, studentName: 'Abebe Kebede', courseId: 3, courseName: 'Database Design', status: 'Pending', enrolledAt: '2026-08-22' },
  { Id: '103', studentId: 103, studentName: 'Liya Kebede', courseId: 2, courseName: 'Angular UI Lab', status: 'Approved', enrolledAt: '2026-08-15' },
  { Id: '104', studentId: 104, studentName: 'Bethlehem Tadesse', courseId: 4, courseName: 'API Security Workshop', status: 'Approved', enrolledAt: '2026-08-18' }
];

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.toLowerCase();

  // Intercept API calls to support offline / standalone demonstration
  if (url.includes('/courses') || url.includes('/enrollments') || url.includes('/grades') || url.includes('/auth')) {
    
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
      const body = (req.body || {}) as { email?: string; password?: string };
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      // Check for active lockout
      const lockoutKey = `tms_lockout_${email}`;
      const lockoutUntilStr = localStorage.getItem(lockoutKey);
      if (lockoutUntilStr) {
        const lockoutUntil = Number(lockoutUntilStr);
        const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
        if (remainingSeconds > 0) {
          return throwError(() => new HttpErrorResponse({
            status: 423,
            statusText: 'Locked',
            error: {
              title: 'Account Locked',
              detail: `Account locked due to multiple failed login attempts. Please wait ${remainingSeconds} seconds.`,
              lockoutSeconds: remainingSeconds
            }
          }));
        } else {
          localStorage.removeItem(lockoutKey);
          localStorage.removeItem(`tms_attempts_${email}`);
        }
      }

      // Check against registered users or demo credentials
      const savedUsersStr = localStorage.getItem('tms_registered_users');
      const registeredUsers: any[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      const foundUser = registeredUsers.find(u => u.email.toLowerCase() === email);

      const isValidDemoPassword = password === 'password123' || password === 'Password123' || password === 'Admin123456!#' || password === 'Student123456!#';
      const isPasswordValid = foundUser ? foundUser.password === password : isValidDemoPassword;

      if (!isPasswordValid) {
        const attemptsKey = `tms_attempts_${email}`;
        const currentAttempts = Number(localStorage.getItem(attemptsKey) || '0') + 1;
        localStorage.setItem(attemptsKey, String(currentAttempts));

        if (currentAttempts >= 6) {
          const lockUntil = Date.now() + 60_000;
          localStorage.setItem(lockoutKey, String(lockUntil));
          localStorage.setItem(attemptsKey, '0');

          return throwError(() => new HttpErrorResponse({
            status: 423,
            statusText: 'Locked',
            error: {
              title: 'Account Locked',
              detail: 'Account has been locked for 60 seconds due to repeated failed login attempts.',
              lockoutSeconds: 60
            }
          }));
        }

        const remaining = 6 - currentAttempts;
        return throwError(() => new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: {
            title: 'Authentication Failed',
            detail: `Invalid email or password. ${remaining} attempt(s) remaining before a 60-second security lockout.`
          }
        }));
      }

      // Successful login -> clear attempt history
      localStorage.removeItem(`tms_attempts_${email}`);
      localStorage.removeItem(lockoutKey);

      const role = foundUser ? foundUser.role : (email.includes('admin') ? 'Admin' : email.includes('instructor') ? 'Instructor' : 'Student');
      const displayName = foundUser ? (foundUser.firstName || foundUser.displayName || email.split('@')[0]) : email.split('@')[0].replace('.', ' ');

      return of(new HttpResponse({
        status: 200,
        body: {
          accessToken: 'mock-jwt-token-xyz',
          refreshToken: 'mock-refresh-token',
          user: {
            email,
            displayName,
            role,
            avatar: role === 'Admin' 
              ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
              : role === 'Instructor'
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }
        }
      }));
    }

    // POST /auth/register
    if (url.includes('/auth/register') && req.method === 'POST') {
      const body = (req.body || {}) as any;
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      const savedUsersStr = localStorage.getItem('tms_registered_users');
      const registeredUsers: any[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];

      if (registeredUsers.some(u => u.email.toLowerCase() === email)) {
        return throwError(() => new HttpErrorResponse({
          status: 409,
          statusText: 'Conflict',
          error: { detail: `A user with email '${email}' is already registered.` }
        }));
      }

      const newUser = {
        email,
        password,
        firstName: body.firstName || email.split('@')[0],
        role: body.role || 'Student',
        createdAt: new Date().toISOString()
      };

      registeredUsers.push(newUser);
      localStorage.setItem('tms_registered_users', JSON.stringify(registeredUsers));

      return of(new HttpResponse({
        status: 200,
        body: { message: 'User registered successfully.', email: newUser.email, role: newUser.role }
      }));
    }

    // POST /auth/forgot-password
    if (url.includes('/auth/forgot-password') && req.method === 'POST') {
      const body = (req.body || {}) as { email?: string };
      const resetToken = `RESET-${Math.floor(100000 + Math.random() * 900000)}`;
      
      return of(new HttpResponse({
        status: 200,
        body: {
          message: 'Password reset token generated successfully.',
          email: body.email,
          resetToken
        }
      }));
    }

    // POST /auth/reset-password
    if (url.includes('/auth/reset-password') && req.method === 'POST') {
      const body = (req.body || {}) as { email?: string; token?: string; newPassword?: string };
      const email = (body.email || '').trim().toLowerCase();
      const newPassword = body.newPassword || '';

      const savedUsersStr = localStorage.getItem('tms_registered_users');
      let registeredUsers: any[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
      registeredUsers = registeredUsers.map(u => u.email.toLowerCase() === email ? { ...u, password: newPassword } : u);
      localStorage.setItem('tms_registered_users', JSON.stringify(registeredUsers));

      // Clear any lockout
      localStorage.removeItem(`tms_lockout_${email}`);
      localStorage.removeItem(`tms_attempts_${email}`);

      return of(new HttpResponse({
        status: 200,
        body: { message: 'Password has been successfully reset. You may now log in.' }
      }));
    }
  }

  return next(req);
};
