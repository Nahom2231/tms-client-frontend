import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { StudentDashboard } from './student-dashboard';

describe('StudentDashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDashboard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StudentDashboard);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});