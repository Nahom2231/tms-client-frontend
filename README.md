# 🎓 Training Management System (TMS) Client

[![Angular](https://img.shields.io/badge/Angular-22.0.0-dd0031.svg?style=flat&logo=angular)](https://angular.io/)
[![NgRx Signals](https://img.shields.io/badge/NgRx_Signals-21.1.1-ba68c8.svg?style=flat&logo=ngrx)](https://ngrx.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![SignalR](https://img.shields.io/badge/Realtime-SignalR-512bd4.svg?style=flat&logo=dotnet)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33.svg?style=flat&logo=playwright)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Unit-Vitest-6E9F18.svg?style=flat&logo=vitest)](https://vitest.dev/)

A modern, high-performance web application for managing training courses, student enrollments, instructor workflows, and academic grades. Built with **Angular 22** standalone components, **NgRx SignalStore** reactive state management, and real-time live synchronization.

---

## 🚀 Features

### 🎓 Student Dashboard
- **Course Enrollment Tracking**: Monitor active, completed, and pending course applications.
- **Analytics & Progress**: Visual metrics showing course completion percentages and earned credits.
- **Certificates Hub**: Access and generate downloadable certificates upon course completion.

### 👨‍🏫 Instructor Portal & Grading
- **Instructor Dashboard**: Manage assigned courses, view active class rosters, and track student enrollment status.
- **Grade Submission System**: Submit, update, and validate student grades with instant feedback.

### 🛡️ Admin & Course Management
- **Course Catalog**: Filterable and searchable directory of available training programs.
- **Admin Management Panel**: Full CRUD operations for creating, updating, and removing courses (protected by role-based route guards).
- **Enrollment Processing**: Admin dashboard for reviewing, approving, or rejecting pending student enrollment requests.

### ⚡ Real-Time Live Sync & State Management
- **SignalR / RxJS Integration**: Real-time state updates across clients for live enrollment status changes and notifications.
- **Reactive State (`@ngrx/signals`)**: Modern SignalStore implementation for fine-grained, performant reactive state tracking (`CourseStore`, `EnrollmentStore`).

### 🎨 Modern UI & Experience
- **Theme Support**: Seamless toggle between Light and Dark mode using custom CSS variables and `ThemeService`.
- **Responsive Layout**: Designed for seamless accessibility across desktops, tablets, and mobile devices using SCSS and Angular Material.

---

## 🛠️ Tech Stack

- **Framework**: [Angular 22](https://angular.dev/) (Standalone Components, Signals API)
- **State Management**: [@ngrx/signals 21](https://ngrx.io/guide/signals)
- **Styling**: Angular Material, SCSS, Bootstrap 5
- **Real-Time Communications**: [@microsoft/signalr](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction) & RxJS 7
- **Routing & Guards**: Angular Router with functional `roleGuard` RBAC protection
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **Unit Testing**: [Vitest](https://vitest.dev/) & JSDOM

---

## 📁 Project Structure

```text
tms-client/
├── e2e/                             # Playwright end-to-end test specs
│   ├── admin-approve-enrollment.spec.ts
│   ├── auth.setup.ts
│   ├── course.spec.ts
│   └── live-sync.spec.ts
├── src/
│   ├── app/
│   │   ├── components/              # Shared component modules
│   │   │   └── admin-course-list/   # Admin course management table & modals
│   │   ├── features/                # Domain-specific feature modules
│   │   │   ├── certificates/        # Certificates generation & view
│   │   │   ├── course-detail/       # Detailed course landing page
│   │   │   ├── enrollment-form/     # Student course application form
│   │   │   ├── enrollment-list/     # Admin approval queue view
│   │   │   ├── grade-submission/    # Instructor grade submission interface
│   │   │   ├── instructor-dashboard/# Instructor overview page
│   │   │   ├── student-dashboard/   # Student dashboard homepage
│   │   │   └── unauthorized/        # 403 Access Denied fallback screen
│   │   ├── guards/                  # Route protection guards
│   │   │   └── role.guard.ts        # RBAC role validation guard
│   │   ├── interceptors/            # HTTP Interceptors
│   │   │   ├── error.interceptor.ts
│   │   │   └── mock-backend.interceptor.ts
│   │   ├── models/                  # TypeScript interface & data definitions
│   │   │   ├── course.model.ts
│   │   │   └── enrollment.model.ts
│   │   ├── services/                # Singleton domain services
│   │   │   ├── auth.service.ts
│   │   │   ├── course.ts
│   │   │   ├── enrollment.service.ts
│   │   │   ├── grade.service.ts
│   │   │   ├── live-sync.ts
│   │   │   └── theme.service.ts
│   │   ├── store/                   # NgRx SignalStore implementations
│   │   │   ├── course.store.ts
│   │   │   └── enrollment.store.ts
│   │   ├── ui/                      # Reusable presentational components
│   │   │   ├── analytics-chart/
│   │   │   └── course-card/
│   │   ├── app.config.ts            # Application root providers & configuration
│   │   ├── app.routes.ts            # Global router routing table
│   │   └── app.ts                   # Shell component & navbar
│   ├── environments/                # Environment configuration targets
│   └── styles.scss                  # Global styles, design tokens & themes
├── angular.json                     # Angular CLI build configuration
├── playwright.config.ts             # Playwright E2E configuration
└── package.json                     # Dependency manifests & project scripts
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or later (Recommended: `v20+`)
- **npm**: `v9.x` or later

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/tms-client.git
   cd tms-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## 🏃 Running the Application

### Development Server

Run the development server using Angular CLI:
```bash
npm start
```
Navigating to `http://localhost:4200/` will load the application. The app will automatically reload if you change any of the source files.

### Production Build

To build the application for production:
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

---

## 🧪 Testing

### Running Unit Tests

Run unit test suites powered by Vitest:
```bash
npm test
```

### Running End-to-End (E2E) Tests

Execute automated end-to-end integration tests using Playwright:
```bash
npx playwright test
```

To run Playwright tests in interactive UI mode:
```bash
npx playwright test --ui
```

---

## 🔐 Route Access Matrix

| Route | View / Feature | Guard Protection |
| :--- | :--- | :--- |
| `/dashboard` | Student Dashboard & Progress | Public / Student |
| `/instructor` | Instructor Dashboard | Instructor |
| `/enrollments` | Enrollment Applications Queue | Admin / Instructor |
| `/courses/:id` | Course Details View | Public |
| `/enroll` | Course Registration Form | Student |
| `/grade-submission` | Grade Submission Portal | Instructor |
| `/admin/courses` | Admin Course Management CRUD | **Admin Only** (`roleGuard`) |
| `/certificates` | Student Completion Certificates | Student |
| `/unauthorized` | 403 Access Denied Screen | Public |

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
