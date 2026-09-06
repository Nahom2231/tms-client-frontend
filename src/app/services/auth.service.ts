import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TmsUser {
  email: string;
  displayName: string;
  role: 'Student' | 'Instructor' | 'Admin';
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  role: 'Student' | 'Instructor' | 'Admin';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface LoginResult {
  success: boolean;
  lockedOut?: boolean;
  lockoutSeconds?: number;
  errorMessage?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user?: TmsUser;
}

const TOKEN_KEY = 'tms_auth_token';
const USER_KEY = 'tms_user';

export const DEFAULT_USERS: Record<'Student' | 'Instructor' | 'Admin', TmsUser> = {
  Student: {
    email: 'student@tms.edu',
    displayName: 'Liya Kebede',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  Instructor: {
    email: 'instructor@tms.edu',
    displayName: 'Prof. Dawit Isaac',
    role: 'Instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  Admin: {
    email: 'admin@tms.edu',
    displayName: 'Dr. Sarah Connor',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  }
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Load initial token and user from localStorage if available
  private accessToken = signal<string | null>(this.getSavedToken());
  currentUser = signal<TmsUser | null>(this.getSavedUser());

  private getSavedToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY) || 'demo-token';
    } catch {
      return 'demo-token';
    }
  }

  private getSavedUser(): TmsUser | null {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallthrough to default
    }
    return DEFAULT_USERS.Admin;
  }

  isAuthenticated(): boolean {
    const user = this.currentUser();
    const token = this.accessToken();
    return !!(user && token && user.email !== 'guest@tms.edu');
  }

  isGuest(): boolean {
    const user = this.currentUser();
    return !user || user.email === 'guest@tms.edu';
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRole(requiredRoles: string | string[]): boolean {
    const user = this.currentUser();
    if (!user) return false;

    // Admin has access to all protected features
    if (user.role === 'Admin') return true;

    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
  }

  continueAsGuest(): void {
    const guestUser: TmsUser = {
      email: 'guest@tms.edu',
      displayName: 'Guest Visitor',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    this.currentUser.set(guestUser);
    this.accessToken.set('guest-token');
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
      localStorage.setItem(TOKEN_KEY, 'guest-token');
    } catch {
      // Ignore storage errors
    }
    this.router.navigate(['/dashboard']);
  }

  switchRole(newRole: 'Student' | 'Instructor' | 'Admin'): void {
    const targetUser = DEFAULT_USERS[newRole] || {
      email: `${newRole.toLowerCase()}@tms.edu`,
      displayName: `${newRole} User`,
      role: newRole
    };

    this.currentUser.set(targetUser);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(targetUser));
    } catch {
      // Ignore localStorage write errors
    }
  }

  validatePasswordPolicy(password: string): { valid: boolean; minLength: boolean; hasUpper: boolean; hasDigit: boolean } {
    const minLength = (password || '').length >= 8;
    const hasUpper = /[A-Z]/.test(password || '');
    const hasDigit = /[0-9]/.test(password || '');
    return {
      valid: minLength && hasUpper && hasDigit,
      minLength,
      hasUpper,
      hasDigit
    };
  }

  validateEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  async login(credentials: LoginRequest): Promise<LoginResult> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/login', credentials)
      );

      this.accessToken.set(res.accessToken);

      let userToSet: TmsUser;
      if (res.user) {
        userToSet = res.user;
      } else {
        try {
          const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
          const roleClaim =
            payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            payload.role ||
            payload.roles?.[0] ||
            'Student';

          userToSet = {
            email: payload.email || payload.sub || credentials.email,
            displayName: payload.name || payload.displayName || credentials.email.split('@')[0],
            role: roleClaim as 'Student' | 'Instructor' | 'Admin'
          };
        } catch {
          const detectedRole: 'Student' | 'Instructor' | 'Admin' = 
            credentials.email.includes('admin') ? 'Admin' :
            credentials.email.includes('instructor') ? 'Instructor' : 'Student';

          userToSet = DEFAULT_USERS[detectedRole];
        }
      }

      this.currentUser.set(userToSet);

      try {
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userToSet));
      } catch {
        // Ignore storage errors
      }

      return { success: true };
    } catch (err: any) {
      console.warn('Login request returned error response:', err);

      // Check for 423 Locked (Lockout)
      if (err instanceof HttpErrorResponse && err.status === 423) {
        const lockoutSeconds = err.error?.lockoutSeconds || 60;
        return {
          success: false,
          lockedOut: true,
          lockoutSeconds,
          errorMessage: err.error?.detail || `Account locked due to multiple failed login attempts. Please wait ${lockoutSeconds} seconds.`
        };
      }

      // Check for 401 Unauthorized
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return {
          success: false,
          errorMessage: err.error?.detail || 'Invalid email or password. Please check your credentials.'
        };
      }

      return {
        success: false,
        errorMessage: err?.error?.detail || err?.message || 'Authentication failed. Please try again.'
      };
    }
  }

  async register(payload: RegisterRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ message?: string; email?: string; role?: string }>('/api/auth/register', payload)
      );

      return {
        success: true,
        message: res.message || 'Account successfully registered! You can now sign in.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.error?.detail || err.message || 'Registration failed. Please check your input.'
      };
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ message?: string; email?: string; resetToken?: string }>('/api/auth/forgot-password', { email })
      );

      return {
        success: true,
        message: res.message || 'Reset instructions generated.',
        resetToken: res.resetToken
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.error?.detail || err.message || 'Failed to process forgot password request.'
      };
    }
  }

  async resetPassword(payload: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ message?: string }>('/api/auth/reset-password', payload)
      );

      return {
        success: true,
        message: res.message || 'Password successfully reset! You can now log in.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.error?.detail || err.message || 'Failed to reset password. Please check your token and criteria.'
      };
    }
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // Storage cleanup
    }
    this.router.navigate(['/login']);
  }
}