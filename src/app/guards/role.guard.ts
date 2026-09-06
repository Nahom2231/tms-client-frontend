import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (requiredRoles: string | string[]): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    // Allow guests to view the main student dashboard
    if (auth.isGuest() && (state.url === '/dashboard' || state.url === '/' || state.url.startsWith('/dashboard'))) {
      return true;
    }

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    if (auth.hasRole(requiredRoles)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};