import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GradeService, GradeRecord } from '../../services/grade.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tms-grade-submission',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './grade-submission.component.html',
  styleUrl: './grade-submission.component.scss'
})
export class GradeSubmissionComponent implements OnInit {
  private api = inject(GradeService);
  private fb = inject(FormBuilder);

  studentsList = [
    { id: 101, name: 'Dawit Alemayehu' },
    { id: 102, name: 'Abebe Kebede' },
    { id: 103, name: 'Liya Kebede' },
    { id: 104, name: 'Bethlehem Tadesse' }
  ];

  coursesList = [
    { id: 1, title: 'Advanced Java Services (CSE-101)' },
    { id: 2, title: 'Angular UI Lab & Design Systems (CSE-210)' },
    { id: 3, title: 'Relational & Distributed Database Design (CSE-305)' },
    { id: 4, title: 'API Security & Zero Trust (CSE-420)' }
  ];

  gradeForm = this.fb.group({
    studentId: [101, [Validators.required, Validators.min(1)]],
    courseId: [1, [Validators.required, Validators.min(1)]],
    score: [92, [Validators.required, Validators.min(0), Validators.max(100)]],
    comments: ['Excellent performance in lab defense.']
  });

  isSubmitting = false;
  submissionStatus = '';
  recentGrades = signal<GradeRecord[]>([]);

  calculatedLetter = signal<string>('A+');

  ngOnInit() {
    this.loadHistory();
    this.updateLetter();
    this.gradeForm.controls.score.valueChanges.subscribe(() => {
      this.updateLetter();
    });
  }

  updateLetter() {
    const score = Number(this.gradeForm.controls.score.value) || 0;
    this.calculatedLetter.set(this.api.calculateLetter(score));
  }

  loadHistory() {
    this.api.getRecentGrades().subscribe(records => {
      this.recentGrades.set(records);
    });
  }

  onSubmit() {
    if (this.gradeForm.valid) {
      this.isSubmitting = true;
      this.submissionStatus = 'Saving grade record to system...';

      const raw = this.gradeForm.getRawValue();
      const sObj = this.studentsList.find(s => s.id === Number(raw.studentId));
      const cObj = this.coursesList.find(c => c.id === Number(raw.courseId));

      this.api.postGrade({
        studentId: Number(raw.studentId),
        courseId: Number(raw.courseId),
        score: Number(raw.score),
        letterGrade: this.calculatedLetter(),
        comments: raw.comments || ''
      }).subscribe({
        next: result => {
          this.isSubmitting = false;
          this.submissionStatus = `Grade saved successfully! Record ID: ${result.id}`;
          
          const newRecord: GradeRecord = {
            id: result.id,
            studentId: Number(raw.studentId),
            studentName: sObj?.name || 'Student Demo',
            courseId: Number(raw.courseId),
            courseTitle: cObj?.title || 'Selected Course',
            score: Number(raw.score),
            letterGrade: this.calculatedLetter(),
            submittedAt: new Date().toLocaleDateString()
          };

          this.recentGrades.update(list => [newRecord, ...list]);
        },
        error: err => {
          this.isSubmitting = false;
          this.submissionStatus = `Submission failed: ${err.message || 'Server error'}`;
        }
      });
    }
  }
}
