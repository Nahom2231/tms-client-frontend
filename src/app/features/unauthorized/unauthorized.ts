import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="unauthorized-container text-center py-5">
      <div class="tms-card max-w-lg mx-auto p-5" style="max-width: 520px;">
        <div class="icon-box mb-4 text-warning">
          <svg class="svg-icon" viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1c1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
        <h1 class="h2 mb-3">Access Restricted</h1>
        <p class="text-muted mb-4">
          Your current user role (<strong>{{ auth.currentUser()?.role }}</strong>) does not have permission to access this page or feature.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <button (click)="auth.switchRole('Admin')" class="btn-tms-primary">
            Switch to Admin Role
          </button>
          <a routerLink="/dashboard" class="btn-tms-outline">
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {
  public auth = inject(AuthService);
}
