import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AnalyticsChart } from '../../ui/analytics-chart/analytics-chart';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AnalyticsChart],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.scss',
})
export class InstructorDashboard implements OnInit {
  store = inject(EnrollmentStore);

  ngOnInit() {
    this.store.listenForLiveUpdates();
    this.store.loadEnrollments();
  }

  approve(id: string) {
    this.store.approveEnrollment(id);
  }

  reject(id: string) {
    this.store.rejectEnrollment(id);
  }
}
