import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-chart',
standalone: true,
  template: `
  <div style="border:1px solid #ccc; padding: 1rem; margin-top; 1rem; background: #f9f9f9;">
  <h3> Enrollment Analytics Engine </h3>
  <p> Loaded 2MB Analytics Library successfully!</p>
  </div>
  `
})
export class AnalyticsChart {}
