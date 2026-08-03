import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'app-enrollment-list',
  imports: [],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss',
})
export class EnrollmentList implements OnInit 
{
  store = inject(EnrollmentStore);

  ngOnInit() {
    this.store.loadEnrollments();
  }
  onApprove(id: string) {
    this.store.approveEnrollment(id);
  }

}
