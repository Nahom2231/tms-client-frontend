import {Injectable, inject } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Observable } from 'rxjs';
import {Enrollment } from '../models/enrollment.model';

@Injectable({
    providedIn: 'root'
})
    export class EnrollmentService {
        private http = inject(HttpClient);
        private baseUrl = 'http://localhost:5029/api/enrollments';
        getAll(): Observable<Enrollment[]> {
            return this.http.get<Enrollment[]>(this.baseUrl);
        }
        approve (id: string): Observable<any> {
            return this.http.post(`${this.baseUrl}/{id}/approve`, {});
        }

    }
