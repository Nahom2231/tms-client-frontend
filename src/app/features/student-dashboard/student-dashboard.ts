import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseCardComponent } from '../../ui/course-card/course-card';
import { Course } from '../../models/course.model';
import { CourseService, INITIAL_COURSES } from '../../services/course';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit {
  private api = inject(CourseService);
  private router = inject(Router);
  readonly store = inject(EnrollmentStore);

  studentName = signal('Liya Kebede');
  studentId = signal('STU-1001');
  earnedCredits = signal(45);
  totalRequiredCredits = 120;

  searchQuery = signal('');
  selectedCategory = signal<string>('All');
  selectedCourse = signal<Course | null>(null);
  enrollmentToast = signal<string | null>(null);

  courses = signal<Course[]>(INITIAL_COURSES);

  graduationStatus = computed(() =>
    this.earnedCredits() >= this.totalRequiredCredits ? 'Eligible for Graduation' : 'Degree in Progress'
  );

  graduationPercentage = computed(() =>
    Math.min(100, Math.round((this.earnedCredits() / this.totalRequiredCredits) * 100))
  );

  categories = ['All', 'Software Engineering', 'Frontend Engineering', 'Data Engineering', 'Cybersecurity', 'Cloud Computing'];

  filteredCourses = computed(() => {
    let list = this.courses();
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    if (cat !== 'All') {
      list = list.filter(c => c.category === cat);
    }
    if (query) {
      list = list.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        (c.instructor && c.instructor.toLowerCase().includes(query))
      );
    }
    return list;
  });

  ngOnInit() {
    this.api.getAll().subscribe(data => {
      if (data && data.length > 0) {
        this.courses.set(data);
      }
    });
  }

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    
    // Add enrollment request to signal store
    this.store.addEnrollment({
      studentId: 101,
      studentName: this.studentName(),
      courseId: course.id,
      courseName: course.title
    });

    this.enrollmentToast.set(`Enrollment request submitted for ${course.title} (${course.code}). Status: Pending Approval.`);

    setTimeout(() => {
      this.enrollmentToast.set(null);
    }, 5000);
  }
}
