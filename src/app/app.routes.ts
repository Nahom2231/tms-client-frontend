import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Sign In | TMS',
    loadComponent: () =>
      import('./features/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    title: 'Sign Up | TMS',
    loadComponent: () =>
      import('./features/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    title: 'Reset Password | TMS',
    loadComponent: () =>
      import('./features/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'dashboard',
    title: 'Student Dashboard | TMS',
    loadComponent: () =>
      import('./features/student-dashboard/student-dashboard').then(m => m.StudentDashboard),
    canActivate: [roleGuard(['Student', 'Admin'])]
  },
  {
    path: 'instructor',
    title: 'Instructor Dashboard | TMS',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard').then(m => m.InstructorDashboard),
    canActivate: [roleGuard(['Instructor', 'Admin'])]
  },
  {
    path: 'enrollments',
    title: 'Enrollment Requests | TMS',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list').then(m => m.EnrollmentList),
    canActivate: [roleGuard(['Admin', 'Instructor'])]
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
      import('./features/enrollment-form/enrollment-form').then(m => m.EnrollmentForm),
    canActivate: [roleGuard(['Student', 'Admin'])]
  },
  {
    path: 'grade-submission',
    title: 'Grade Submission | TMS',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission.component').then(m => m.GradeSubmissionComponent),
    canActivate: [roleGuard(['Instructor', 'Admin'])]
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
      import('./features/certificates/certificates').then(m => m.CertificatesComponent),
    canActivate: [roleGuard(['Student', 'Admin'])]
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

