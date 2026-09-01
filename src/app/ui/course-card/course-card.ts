import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tms-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCardComponent {
  course = input.required<Course>();
  enrollClicked = output<Course>();

  getCapacityPercentage(c: Course): number {
    if (!c.maxCapacity) return 0;
    return Math.min(100, Math.round((c.enrollmentCount / c.maxCapacity) * 100));
  }
}
