import { Component, signal, computed } from '@angular/core';
import { CourseCard } from '../../ui/course-card/course-card';
import {Course} from '../../models/course.model';

@Component({
  selector: 'app-student-dashboard',
  standalone:true,
  imports: [CourseCard],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard {
  studentName =signal("Liya kebede");
  earnedCredits = signal(45);

  graduationStatus= computed(() =>

    this.earnedCredits() >=120 ? "ELigible for Graduation" : "In Progress"
);

registerForClass() {
  this.earnedCredits.update((c) => c + 3);
}

selectedCourse= signal<Course |null>(null);

sampleCourse: Course = {
  id: 1,
  title: 'Advanced Java Services',
  code: 'CSE-101',
  maxCapacity: 30,
  enrollmentCount: 30
};
handleEnroll(course: Course) {
  this.selectedCourse.set(course);
  console.log('Enrollment requested for :' , course.title);
}
}
