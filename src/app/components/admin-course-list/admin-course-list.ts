import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [],
  templateUrl: './admin-course-list.html',
  styleUrl: './admin-course-list.scss',
})
export class AdminCourseListComponent {
  public auth = inject(AuthService);

  courses = [
    { id: 1, title: 'Web Architecture & Security' },
    { id: 2, title: 'Cloud Infrastructure & DevOps' }
  ];

  deleteCourse(courseId: number): void {
    this.courses = this.courses.filter(c => c.id !== courseId);
    console.log(`Course ${courseId} deleted.`);
  }
}