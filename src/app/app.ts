import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from './store/enrollment.store';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { LiveSyncService } from './services/live-sync';

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

  showNotifications = false;

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
