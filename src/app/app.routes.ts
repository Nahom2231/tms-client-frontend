import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    title: 'Student Dashboard | TMS',
    loadComponent: () =>
      import('./features/student-dashboard/student-dashboard').then(m => m.StudentDashboard)
  },
  {
    path: 'instructor',
    title: 'Instructor Dashboard | TMS',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard').then(m => m.InstructorDashboard)
  },
  {
    path: 'enrollments',
    title: 'Enrollment Requests | TMS',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list').then(m => m.EnrollmentList)
  },
  {
    path: 'courses/:id',
    title: 'Course Details | TMS',
    loadComponent: () =>
      import('./features/course-detail/course-detail').then(m => m.CourseDetail)
  },
  {
    path: 'enroll',
    title: 'New Enrollment | TMS',
    loadComponent: () =>
      import('./features/enrollment-form/enrollment-form').then(m => m.EnrollmentForm)
  },
  {
    path: 'grade-submission',
    title: 'Grade Submission | TMS',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission.component').then(m => m.GradeSubmissionComponent)
  },
  {
    path: 'admin/courses',
    title: 'Admin Course Management | TMS',
    loadComponent: () =>
      import('./components/admin-course-list/admin-course-list').then(m => m.AdminCourseListComponent),
    canActivate: [roleGuard('Admin')]
  },
  {
    path: 'certificates',
    title: 'My Certificates | TMS',
    loadComponent: () =>
      import('./features/certificates/certificates').then(m => m.CertificatesComponent)
  },
  {
    path: 'unauthorized',
    title: 'Access Denied | TMS',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
