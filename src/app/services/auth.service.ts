import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private accessToken = signal<string | null>('demo-token');

  // Default demo user profile
  currentUser = signal<TmsUser>({
    email: 'admin@tms.edu',
    displayName: 'Dr. Sarah Connor',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  });

  getAccessToken(): string | null {
    return this.accessToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    if (user.role === 'Admin') return true; // Admin has access to everything
    return user.role === role;
  }

  switchRole(newRole: 'Student' | 'Instructor' | 'Admin'): void {
    const names = {
      Student: 'Liya Kebede',
      Instructor: 'Prof. Dawit Isaac',
      Admin: 'Dr. Sarah Connor'
    };
    
    this.currentUser.update(u => ({
      ...u,
      role: newRole,
      displayName: names[newRole] || u.displayName,
      email: `${newRole.toLowerCase()}@tms.edu`
    }));
  }

  async login(credentials: LoginRequest): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
          catchError(() => {
            // Demo fallback if backend is offline
            return of({
              accessToken: 'mock-jwt-token-xyz',
              refreshToken: 'mock-refresh-token'
            });
          })
        )
      );

      this.accessToken.set(res.accessToken);

      try {
        const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
        this.currentUser.set({
          email: payload.email || payload.sub || credentials.email,
          displayName: payload.name || payload.email || 'User',
          role:
            payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            payload.role ||
            'Admin'
        });
      } catch {
        // Fallback for mock token
        this.currentUser.set({
          email: credentials.email,
          displayName: credentials.email.split('@')[0],
          role: credentials.email.includes('admin') ? 'Admin' : 'Student'
        });
      }
    } catch (err) {
      console.warn('Auth fallback active:', err);
    }
  }

  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set({
      email: 'guest@tms.edu',
      displayName: 'Guest User',
      role: 'Student'
    });
  }
}