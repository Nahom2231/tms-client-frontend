import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="unauthorized-container text-center py-5">
      <div class="tms-card max-w-lg mx-auto p-5">
        <div class="icon-box mb-4">
          <span style="font-size: 4rem;">🔒</span>
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
