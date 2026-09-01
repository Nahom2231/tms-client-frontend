import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CourseStore } from '../../store/course.store';
import { Course } from '../../models/course.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-course-list.html',
  styleUrl: './admin-course-list.scss',
})
export class AdminCourseListComponent {
  public auth = inject(AuthService);
  public store = inject(CourseStore);

  showCreateModal = signal(false);
  searchFilter = signal('');

  // New Course Form State
  newTitle = signal('');
  newCode = signal('');
  newCapacity = signal(30);
  newCategory = signal('Software Engineering');
  newInstructor = signal('Prof. Elena Rostova');
  newCredits = signal(4);

  coursesList = computed(() => {
    const query = this.searchFilter().toLowerCase().trim();
    const all = this.store.entities();
    if (!query) return all;
    return all.filter(c => 
      c.title.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      (c.instructor && c.instructor.toLowerCase().includes(query))
    );
  });

  constructor() {
    this.store.loadAll();
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  saveCourse() {
    if (!this.newTitle() || !this.newCode()) return;

    this.store.addCourse({
      title: this.newTitle(),
      code: this.newCode(),
      maxCapacity: this.newCapacity(),
      category: this.newCategory(),
      instructor: this.newInstructor(),
      credits: this.newCredits(),
      enrollmentCount: 0
    });

    this.newTitle.set('');
    this.newCode.set('');
    this.closeCreateModal();
  }

  deleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course module?')) {
      this.store.deleteCourse(courseId);
    }
  }
}