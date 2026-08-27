import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CourseDetail } from './course-detail'; // or './course-detail.component'

describe('CourseDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CourseDetail);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});