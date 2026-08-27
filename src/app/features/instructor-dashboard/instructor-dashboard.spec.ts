import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { InstructorDashboard } from './instructor-dashboard';
import { LiveSyncService } from '../../services/live-sync';

describe('InstructorDashboard', () => {
  const mockLiveSync = {
    connect: () => {},
    events$: EMPTY,
    disconnect: () => {},
    emitLocalUpdate: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorDashboard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: LiveSyncService, useValue: mockLiveSync }
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(InstructorDashboard);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});