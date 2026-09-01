import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-chart.html',
  styleUrl: './analytics-chart.scss'
})
export class AnalyticsChart {
  activeTab = signal<'trends' | 'completion' | 'grades'>('trends');

  trendData = [
    { month: 'Jan', enrollments: 45, completion: 40 },
    { month: 'Feb', enrollments: 62, completion: 55 },
    { month: 'Mar', enrollments: 85, completion: 78 },
    { month: 'Apr', enrollments: 120, completion: 110 },
    { month: 'May', enrollments: 140, completion: 132 },
    { month: 'Jun', enrollments: 165, completion: 150 }
  ];

  gradeDistribution = [
    { grade: 'A+ / A', percentage: 42, count: 84, color: '#10b981' },
    { grade: 'B+ / B', percentage: 35, count: 70, color: '#6366f1' },
    { grade: 'C+ / C', percentage: 15, count: 30, color: '#f59e0b' },
    { grade: 'D / F', percentage: 8, count: 16, color: '#ef4444' }
  ];

  setTab(tab: 'trends' | 'completion' | 'grades'): void {
    this.activeTab.set(tab);
  }
}
