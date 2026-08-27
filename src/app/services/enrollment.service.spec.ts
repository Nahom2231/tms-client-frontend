import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentService', () => {
  let httpMock: HttpTestingController;
  let service: EnrollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), EnrollmentService],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EnrollmentService);
  });

  afterEach(() => httpMock.verify());

  it('approve(id) issues approve request and returns updated enrollment', async () => {
    const result = firstValueFrom(service.approve('42' as any));

    // Match any request ending with approve
    const req = httpMock.expectOne((r) => r.url.includes('/api/enrollments') && r.url.endsWith('/approve'));
    
    // Accept either POST or PUT depending on your service implementation
    expect(['POST', 'PUT']).toContain(req.request.method);

    req.flush({
      id: 42,
      studentId: 11,
      studentName: 'Abeba',
      courseId: 101,
      courseName: 'Intro to CS',
      status: 'Approved',
      enrolledAt: '2026-08-12T10:00:00Z',
    });

    const approved = await result;
    expect(approved.status).toBe('Approved');
  });
});