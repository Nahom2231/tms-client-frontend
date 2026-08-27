import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CourseCardComponent } from '../../ui/course-card/course-card';
import {Course, PagedResponse} from '../../models/course.model';
import { CourseService } from "../../services/course";
import {rxResource} from '@angular/core/rxjs-interop';
import { EnrollmentStore } from '../../store/enrollment.store';
@Component({
  selector: 'app-student-dashboard',
  standalone:true,
  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit {
  private api= inject(CourseService);
  readonly store = inject(EnrollmentStore);
  studentName =signal("Liya kebede");
  earnedCredits = signal(45);

  graduationStatus= computed(() =>

    this.earnedCredits() >=120 ? "ELigible for Graduation" : "In Progress"
);

coursesResource = rxResource({
  stream: () => this.api.getAll(),
});
ngOnInit()
{
  this.store.listenForLiveUpdates();
}
registerForClass() {
  this.earnedCredits.update((c) => c + 3);
}

selectedCourse= signal<Course |null>(null);
availableCourses = signal<Course[]>([
  {
    id: 1,
    title: 'Advanced Java Services',
    code: 'CSE-101',
    maxCapacity: 30,
    enrollmentCount:10
  },
  {
    id: 2,
    title: 'Angular UI Lab',
    code: 'CSE-210',
    maxCapacity:25,
    enrollmentCount:25

  },
  {
    id: 3,
    title: 'Database Design',
    code: 'CSE-305',
    maxCapacity: 20,
    enrollmentCount:18
  },
  {
    id: 4,
    title:'API security workshop',
    code: 'CSE-420',
    maxCapacity: 40,
    enrollmentCount: 15
  }
]);
handleEnroll(course:Course){
  this.selectedCourse.set(course);
  console.log('Enrollment requested for:', course.title);
}

}
