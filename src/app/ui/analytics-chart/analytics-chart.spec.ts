import { TestBed } from '@angular/core/testing';
import { AnalyticsChart } from './analytics-chart'; // or './analytics-chart.component'

describe('AnalyticsChart', () => {
  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AnalyticsChart],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AnalyticsChart);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});