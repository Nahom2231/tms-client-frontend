import { Component, input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Course } from '../../models/course.model';
import { CourseService, INITIAL_COURSES } from '../../services/course';
import { EnrollmentStore } from '../../store/enrollment.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail implements OnInit {
  // Optional input signal with safe fallback default
  id = input<string>('1');

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private enrollmentStore = inject(EnrollmentStore);
  public auth = inject(AuthService);

  course = signal<Course | undefined>(undefined);
  enrolledSuccess = signal(false);

  syllabusModules = [
    { week: 'Week 1-2', title: 'Architecture Overview & Domain Boundaries', topics: ['Monolith to Microservices', 'Domain-Driven Design (DDD)', 'Service Contracts & OpenAPI'] },
    { week: 'Week 3-4', title: 'Data Persistence & Distributed State', topics: ['CQRS Pattern', 'Event Sourcing basics', 'Database per Service isolation'] },
    { week: 'Week 5-6', title: 'Resilience, Testing & Security', topics: ['Circuit Breaker (Resilience4j)', 'OAuth2 / OIDC Token propagation', 'Integration testing'] },
    { week: 'Week 7-8', title: 'Capstone Project & Cloud Deployment', topics: ['Dockerizing Spring & Angular apps', 'Kubernetes Deployment & Helm', 'Final Defense'] }
  ];

  ngOnInit() {
    // Safely retrieve parameter from signal input or route snapshot
    const routeId = this.id() || this.route.snapshot.paramMap.get('id') || '1';
    const numId = Number(routeId);

    this.courseService.getById(numId).subscribe(found => {
      if (found) {
        this.course.set(found);
      } else {
        const fallback = INITIAL_COURSES.find(c => c.id === numId) || INITIAL_COURSES[0];
        this.course.set(fallback);
      }
    });
  }

  enroll() {
    const c = this.course();
    if (!c) return;

    this.enrollmentStore.addEnrollment({
      studentId: 101,
      studentName: this.auth.currentUser()?.displayName || 'Liya Kebede',
      courseId: c.id,
      courseName: c.title
    });

    this.enrolledSuccess.set(true);
  }
}
