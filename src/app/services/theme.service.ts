import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Theme state signal
  currentTheme = signal<ThemeMode>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('tms-theme') as ThemeMode | null;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        this.currentTheme.set(savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme.set(prefersDark ? 'dark' : 'light');
      }

      effect(() => {
        const theme = this.currentTheme();
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = `${theme}-theme`;
        localStorage.setItem('tms-theme', theme);
      });
    }
  }

  toggleTheme(): void {
    this.currentTheme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
