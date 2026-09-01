import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const detailMessage = err.error?.detail ?? 'A system error occurred. Please try again.';

      if (err.status === 401) {
        router.navigate(['/login']);
      } else if (err.status === 404 || err.status === 0) {
        // Log friendly debug warning instead of error console noise when running in standalone mode
        console.warn(`[TMS Fallback Mode] Endpoint ${req.url} unreachable (Status ${err.status}). Using local interactive mock data.`);
      } else {
        console.error('API Error Response:', detailMessage);
      }
      return throwError(() => err);
    })
  );
};