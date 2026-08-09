import { Component, inject, OnInit } from '@angular/core';
import {EnrollmentStore } from '../../store/enrollment.store';
import { AnalyticsChart } from '../../ui/analytics-chart/analytics-chart';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [AnalyticsChart],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.scss',
})
export class InstructorDashboard implements OnInit {
  store =inject(EnrollmentStore);
  ngOnInit(){
  
  this.store.listenForLiveUpdates();
}
}
