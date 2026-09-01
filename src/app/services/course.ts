import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Course, PagedResponse } from '../models/course.model';

export const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    code: 'CSE-101',
    title: 'Advanced Java Services',
    maxCapacity: 30,
    enrollmentCount: 22,
    status: 'Active',
    category: 'Software Engineering',
    instructor: 'Dr. Marcus Vance',
    credits: 4,
    description: 'Deep dive into modern microservices architecture, Spring Boot, reactive programming, and cloud deployment resilience.'
  },
  {
    id: 2,
    code: 'CSE-210',
    title: 'Angular UI Lab & Design Systems',
    maxCapacity: 25,
    enrollmentCount: 25,
    status: 'Full',
    category: 'Frontend Engineering',
    instructor: 'Prof. Elena Rostova',
    credits: 3,
    description: 'Master Angular Signals, state management with NgRx, micro-frontend architecture, and modern CSS design systems.'
  },
  {
    id: 3,
    code: 'CSE-305',
    title: 'Relational & Distributed Database Design',
    maxCapacity: 20,
    enrollmentCount: 18,
    status: 'Active',
    category: 'Data Engineering',
    instructor: 'Dr. Sarah Connor',
    credits: 4,
    description: 'PostgreSQL indexing, query optimization, NoSQL replication models, and enterprise transaction safety.'
  },
  {
    id: 4,
    code: 'CSE-420',
    title: 'API Security & Zero Trust Architecture',
    maxCapacity: 40,
    enrollmentCount: 15,
    status: 'Active',
    category: 'Cybersecurity',
    instructor: 'Cmdr. Alex Mercer',
    credits: 3,
    description: 'OAuth2/OIDC protocols, JWT vulnerability prevention, API gateway rate limiting, and threat modeling.'
  },
  {
    id: 5,
    code: 'CSE-510',
    title: 'Cloud Infrastructure & DevOps Pipelines',
    maxCapacity: 35,
    enrollmentCount: 29,
    status: 'Active',
    category: 'Cloud Computing',
    instructor: 'Ing. David Chen',
    credits: 4,
    description: 'Docker containerization, Kubernetes orchestration, GitHub Actions CI/CD pipelines, and Terraform IaC.'
  }
];

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private readonly base = `${(environment as any).apiUrl || 'http://localhost:5029/api/v1'}/courses`;

  getAll(): Observable<Course[]> {
    const saved = localStorage.getItem('tms_courses');
    const localData = saved ? JSON.parse(saved) : INITIAL_COURSES;

    return this.http.get<PagedResponse<Course>>(this.base, {
      params: { page: '1', pageSize: '50' }
    }).pipe(
      map(response => response.items),
      catchError(() => of(localData))
    );
  }

  getById(id: number): Observable<Course | undefined> {
    return this.getAll().pipe(
      map(courses => courses.find(c => c.id === id))
    );
  }

  create(course: Partial<Course>): Observable<Course> {
    const saved = localStorage.getItem('tms_courses');
    const list: Course[] = saved ? JSON.parse(saved) : [...INITIAL_COURSES];

    const newCourse: Course = {
      id: Date.now(),
      code: course.code || `CSE-${Math.floor(100 + Math.random() * 900)}`,
      title: course.title || 'Untitled Course',
      maxCapacity: Number(course.maxCapacity) || 30,
      enrollmentCount: 0,
      status: 'Active',
      category: course.category || 'General CS',
      instructor: course.instructor || 'Staff Instructor',
      credits: Number(course.credits) || 3,
      description: course.description || 'No description provided.'
    };

    list.unshift(newCourse);
    localStorage.setItem('tms_courses', JSON.stringify(list));
    return of(newCourse);
  }

  delete(id: number): Observable<void> {
    const saved = localStorage.getItem('tms_courses');
    const list: Course[] = saved ? JSON.parse(saved) : [...INITIAL_COURSES];
    const filtered = list.filter(c => c.id !== id);
    localStorage.setItem('tms_courses', JSON.stringify(filtered));

    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }
}