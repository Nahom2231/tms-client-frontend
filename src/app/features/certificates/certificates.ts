import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface Certificate {
  id: string;
  courseTitle: string;
  courseCode: string;
  completionDate: string;
  grade: string;
  instructor: string;
  issueNumber: string;
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-1 d-flex align-items-center gap-2">
            <svg class="svg-icon text-primary" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            My Certificates & Achievements
          </h1>
          <p class="text-muted mb-0">Official verified credentials issued upon course completion</p>
        </div>
        <a routerLink="/dashboard" class="btn-tms-outline">← Back to Dashboard</a>
      </div>

      <div class="row g-4">
        @for (cert of certificates(); track cert.id) {
          <div class="col-12 col-lg-6">
            <div class="tms-card cert-card p-4 h-100 position-relative overflow-hidden">
              <div class="cert-watermark">VERIFIED</div>
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="tms-badge badge-approved">Official Certificate</span>
                <span class="text-muted small">Issued: {{ cert.completionDate }}</span>
              </div>
              <h3 class="h4 mb-2">{{ cert.courseTitle }}</h3>
              <p class="text-muted small mb-3">Code: <strong>{{ cert.courseCode }}</strong> | Instructor: {{ cert.instructor }}</p>
              
              <div class="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
                <div>
                  <small class="text-muted d-block">Student</small>
                  <strong>{{ auth.currentUser()?.displayName }}</strong>
                </div>
                <div class="text-end">
                  <small class="text-muted d-block">Grade Earned</small>
                  <span class="badge bg-success px-3 py-2 fs-6">{{ cert.grade }}</span>
                </div>
              </div>

              <div class="mt-4 d-flex gap-2">
                <button (click)="printCert(cert)" class="btn-tms-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-2">
                  <svg class="svg-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1zm-1-9H6v4h12V3z"/>
                  </svg>
                  Print / Download PDF
                </button>
                <button (click)="shareCert(cert)" class="btn-tms-outline btn-sm d-flex align-items-center gap-1">
                  <svg class="svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                  </svg>
                  Share Link
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center py-5">
            <p class="text-muted">No completed course certificates found yet.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cert-card {
      border: 1px solid var(--primary-color);
      background: var(--bg-card);
    }
    .cert-watermark {
      position: absolute;
      right: -20px;
      bottom: -20px;
      font-size: 4.5rem;
      font-weight: 900;
      color: var(--primary-color);
      opacity: 0.05;
      pointer-events: none;
      transform: rotate(-15deg);
    }
  `]
})
export class CertificatesComponent {
  public auth = inject(AuthService);

  certificates = signal<Certificate[]>([
    {
      id: 'CERT-2026-901',
      courseTitle: 'Angular UI Lab & Design Systems',
      courseCode: 'CSE-210',
      completionDate: 'August 15, 2026',
      grade: 'A+',
      instructor: 'Prof. Elena Rostova',
      issueNumber: 'TMS-99042-88'
    },
    {
      id: 'CERT-2026-902',
      courseTitle: 'API Security Workshop & Zero Trust',
      courseCode: 'CSE-420',
      completionDate: 'July 28, 2026',
      grade: 'A',
      instructor: 'Cmdr. Alex Mercer',
      issueNumber: 'TMS-88412-19'
    }
  ]);

  printCert(cert: Certificate): void {
    window.print();
  }

  shareCert(cert: Certificate): void {
    alert(`Certificate verification link copied: https://tms.edu/verify/${cert.issueNumber}`);
  }
}
