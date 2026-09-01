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
          <h1 class="h3 mb-1">My Certificates & Achievements</h1>
          <p class="text-muted mb-0">Official verified credentials issued upon course completion</p>
        </div>
        <a routerLink="/dashboard" class="btn-tms-outline">← Back to Dashboard</a>
      </div>

      <div class="row g-4">
        @for (cert of certificates(); track cert.id) {
          <div class="col-12 col-lg-6">
            <div class="tms-card cert-card p-4 h-100 position-relative overflow-hidden">
              <div class="cert-watermark">ACCEPTED</div>
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
                <button (click)="printCert(cert)" class="btn-tms-primary btn-sm flex-grow-1">
                  🖨️ Print / Download PDF
                </button>
                <button (click)="shareCert(cert)" class="btn-tms-outline btn-sm">
                  🔗 Share Link
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
      border: 2px solid var(--primary-color);
      background: linear-gradient(145deg, var(--bg-card), var(--bg-card-hover));
    }
    .cert-watermark {
      position: absolute;
      right: -20px;
      bottom: -20px;
      font-size: 5rem;
      font-weight: 900;
      color: var(--primary-color);
      opacity: 0.04;
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
