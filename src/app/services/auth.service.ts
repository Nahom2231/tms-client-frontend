import { Injectable, inject, signal } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TmsUser {
    displayName: string;
    role: string;

}
export interface LoginRequest {
    username:string;
    password: string;
}
@Injectable ({
    providedIn: 'root',
}) 
export class AuthService {
    private http = inject(HttpClient);
    currentUser = signal<TmsUser|null>(null);
    hasRole(role: string): boolean {
        const user = this.currentUser();
        return user?.role===role || user?.role=== 'Admin';
    }
    async login(credentials: LoginRequest): Promise<void> {
     
      await firstValueFrom(
        this.http.post<TmsUser>('/api/v1/auth/login', credentials)

      );

      const user = await firstValueFrom(
        this.http.get<TmsUser>('/api/v1/auth/me')
      );

      this.currentUser.set(user);

    }
}