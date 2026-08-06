import { Component, viewChild, effect, inject,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {Enrollment } from '../../models/enrollment.model';


@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule ],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss',
})
export class EnrollmentList 
{
  store = inject(EnrollmentStore);
  displayedColumns: string[] =['studentName', 'courseName', 'status', 'actions'];

  dataSource = new MatTableDataSource<Enrollment>();

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);
  constructor() {
    effect(() => {
      this.dataSource.data = this.store.entities();

    });
    effect(() => {
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });
  }

  approve(id: string) {
    if(this.store.approveEnrollment){
    this.store.approveEnrollment(id);
  }

    }
  }
