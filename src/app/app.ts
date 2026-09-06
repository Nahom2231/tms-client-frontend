import { Component, inject, OnInit, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from './store/enrollment.store';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { LiveSyncService } from './services/live-sync';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  public store = inject(EnrollmentStore);
  public auth = inject(AuthService);
  public theme = inject(ThemeService);
  public sync = inject(LiveSyncService);
  public router = inject(Router);

  showNotifications = false;

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects || (e as NavigationEnd).url)
    ),
    { initialValue: this.router.url }
  );

  isAuthRoute = computed(() => {
    const url = (this.currentUrl() || '').toLowerCase();
    return url.includes('/login') || url.includes('/register') || url.includes('/forgot-password');
  });

  ngOnInit() {
    this.store.listenForLiveUpdates();
    this.store.loadEnrollments();
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
