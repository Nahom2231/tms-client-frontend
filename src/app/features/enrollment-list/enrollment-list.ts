import { Component, viewChild, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentStore } from '../../store/enrollment.store';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Enrollment } from '../../models/enrollment.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss',
})
export class EnrollmentList {
  store = inject(EnrollmentStore);
  displayedColumns: string[] = ['studentName', 'courseName', 'enrolledAt', 'status', 'actions'];

  dataSource = new MatTableDataSource<Enrollment>();
  filterQuery = signal('');

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);

  constructor() {
    effect(() => {
      const data = this.store.entities();
      this.dataSource.data = data;
    });

    effect(() => {
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  approve(id: string) {
    this.store.approveEnrollment(id);
  }

  reject(id: string) {
    this.store.rejectEnrollment(id);
  }
}
