import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.scss',
})
export class EnrollmentForm {
  private fb = inject(FormBuilder);
  private store = inject(EnrollmentStore);
  private router = inject(Router);

  submitted = signal(false);

  // Available courses list for dropdown
  coursesList = [
    { id: 1, title: 'Advanced Java Services (CSE-101)' },
    { id: 2, title: 'Angular UI Lab & Design Systems (CSE-210)' },
    { id: 3, title: 'Relational & Distributed Database Design (CSE-305)' },
    { id: 4, title: 'API Security & Zero Trust Architecture (CSE-420)' },
    { id: 5, title: 'Cloud Infrastructure & DevOps Pipelines (CSE-510)' }
  ];

  form = this.fb.nonNullable.group({
    studentId: [
      'STU-1001',
      // FIX: Allow hyphen in student ID pattern STU-1001 or STU1001
      [Validators.required, Validators.pattern('^STU-?[0-9]{4}$')],
    ],
    studentName: ['Liya Kebede', Validators.required],
    courseId: ['1', Validators.required],
    term: ['Fall 2026', Validators.required],
    notes: ['Special request for morning lab session.'],
    backupCourses: this.fb.array<FormControl<string>>([]),
  });

  get backups() {
    return this.form.controls.backupCourses;
  }

  addBackup() {
    this.backups.push(
      this.fb.control('', { nonNullable: true, validators: Validators.required })
    );
  }

  removeBackup(index: number) {
    this.backups.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      const payload = this.form.getRawValue();
      
      const selectedCourseObj = this.coursesList.find(c => String(c.id) === String(payload.courseId));
      
      this.store.addEnrollment({
        studentId: Number(payload.studentId.replace(/\D/g, '')) || 101,
        studentName: payload.studentName,
        courseId: Number(payload.courseId),
        courseName: selectedCourseObj?.title || 'Selected Course'
      });

      this.submitted.set(true);
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetForm() {
    this.submitted.set(false);
    this.form.reset({
      studentId: 'STU-1001',
      studentName: 'Liya Kebede',
      courseId: '1',
      term: 'Fall 2026',
      notes: ''
    });
  }
}
