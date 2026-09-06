import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

const LOCKOUT_KEY = 'tms_login_lockout_until';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  public auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Lockout state
  lockoutSeconds = signal(0);
  private timerInterval: any = null;

  // Real-time policy checking
  emailTouched = signal(false);
  passwordTouched = signal(false);

  get returnUrl(): string {
    return this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit() {
    this.checkExistingLockout();
    if (this.route.snapshot.queryParams['registered']) {
      this.successMessage.set('Account registered successfully! Please sign in with your credentials.');
    } else if (this.route.snapshot.queryParams['reset']) {
      this.successMessage.set('Password reset successfully! Please sign in with your new password.');
    }
  }

  ngOnDestroy() {
    this.clearLockoutTimer();
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  private checkExistingLockout() {
    const lockoutUntilStr = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutUntilStr) {
      const lockoutUntil = Number(lockoutUntilStr);
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining > 0) {
        this.startLockoutCountdown(remaining);
      } else {
        localStorage.removeItem(LOCKOUT_KEY);
      }
    }
  }

  private startLockoutCountdown(seconds: number) {
    this.lockoutSeconds.set(seconds);
    this.errorMessage.set(`Too many failed attempts. Security lockout active for ${seconds}s.`);
    this.clearLockoutTimer();

    this.timerInterval = setInterval(() => {
      const current = this.lockoutSeconds();
      if (current <= 1) {
        this.clearLockoutTimer();
        this.lockoutSeconds.set(0);
        this.errorMessage.set('');
        localStorage.removeItem(LOCKOUT_KEY);
      } else {
        this.lockoutSeconds.set(current - 1);
      }
    }, 1000);
  }

  private clearLockoutTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  isEmailValid(): boolean {
    return this.auth.validateEmail(this.credentials.email);
  }

  passwordPolicy() {
    return this.auth.validatePasswordPolicy(this.credentials.password);
  }

  async onSubmit(): Promise<void> {
    if (this.lockoutSeconds() > 0) {
      return;
    }

    this.emailTouched.set(true);
    this.passwordTouched.set(true);

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage.set('Please provide both email address and password.');
      return;
    }

    if (!this.isEmailValid()) {
      this.errorMessage.set('Please provide a valid email format (e.g. user@tms.edu).');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const result = await this.auth.login(this.credentials);
    this.isLoading.set(false);

    if (result.success) {
      this.clearLockoutTimer();
      localStorage.removeItem(LOCKOUT_KEY);

      const user = this.auth.currentUser();
      if (this.route.snapshot.queryParams['returnUrl']) {
        this.router.navigateByUrl(this.returnUrl);
      } else if (user?.role === 'Admin') {
        this.router.navigate(['/admin/courses']);
      } else if (user?.role === 'Instructor') {
        this.router.navigate(['/instructor']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      if (result.lockedOut) {
        const secs = result.lockoutSeconds || 60;
        const lockUntil = Date.now() + secs * 1000;
        localStorage.setItem(LOCKOUT_KEY, String(lockUntil));
        this.startLockoutCountdown(secs);
      } else {
        this.errorMessage.set(result.errorMessage || 'Invalid email or password.');
      }
    }
  }

  continueAsGuest(): void {
    this.auth.continueAsGuest();
  }

  quickLogin(role: 'Student' | 'Instructor' | 'Admin'): void {
    if (this.lockoutSeconds() > 0) return;

    const emails = {
      Student: 'student@tms.edu',
      Instructor: 'instructor@tms.edu',
      Admin: 'admin@tms.edu'
    };

    this.credentials.email = emails[role];
    this.credentials.password = 'password123';
    this.onSubmit();
  }
}
