import { LiveSyncService } from './../services/live-sync';
import { inject, computed } from '@angular/core';
import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';
import { tap, catchError, EMPTY, switchMap, pipe } from 'rxjs';
import { signalStore, withState, withComputed, patchState, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

const INITIAL_ENROLLMENTS: Enrollment[] = [
  { Id: '101', studentId: 101, studentName: 'Dawit Alemayehu', courseId: 1, courseName: 'Advanced Java Services', status: 'Pending', enrolledAt: '2026-08-28' },
  { Id: '102', studentId: 102, studentName: 'Abebe Kebede', courseId: 3, courseName: 'Database Design', status: 'Pending', enrolledAt: '2026-08-25' },
  { Id: '103', studentId: 103, studentName: 'Liya Kebede', courseId: 2, courseName: 'Angular UI Lab', status: 'Approved', enrolledAt: '2026-08-20' },
  { Id: '104', studentId: 104, studentName: 'Bethlehem Tadesse', courseId: 4, courseName: 'API Security Workshop', status: 'Approved', enrolledAt: '2026-08-18' }
];

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({
    isLoading: false,
    error: null as string | null,
    entities: INITIAL_ENROLLMENTS
  }),
  withComputed((store) => ({
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === 'Pending').length
    ),
    approvedCount: computed(
      () => store.entities().filter((e) => e.status === 'Approved').length
    ),
    totalCount: computed(
      () => store.entities().length
    )
  })),
  withMethods((store, api = inject(EnrollmentService), sync = inject(LiveSyncService)) => ({
    seed(items: Enrollment[]) {
      patchState(store, { entities: items });
    },
    listenForLiveUpdates: rxMethod<void>(
      pipe(
        tap(() => sync.connect()),
        switchMap(() => sync.events$),
        tap((event) => {
          patchState(store, {
            entities: store.entities().map((e) =>
              (e.Id === event.id || (e as any).id === event.id) ? { ...e, status: event.status } : e
            )
          });
        })
      )
    ),
    loadEnrollments(): void {
      patchState(store, { isLoading: true, error: null });
      api.getAll()
        .pipe(
          tap((entities) => patchState(store, { entities, isLoading: false })),
          catchError(() => {
            patchState(store, { isLoading: false, error: 'Loaded local fallback enrollments.' });
            return EMPTY;
          })
        )
        .subscribe();
    },
    approveEnrollment(id: string): void {
      patchState(store, {
        entities: store.entities().map((e) =>
          (e.Id === id || (e as any).id === id) ? { ...e, status: 'Approved' } : e
        )
      });
      sync.emitLocalUpdate(id, 'Approved');
      api.approve(id).subscribe();
    },
    rejectEnrollment(id: string): void {
      patchState(store, {
        entities: store.entities().map((e) =>
          (e.Id === id || (e as any).id === id) ? { ...e, status: 'Rejected' } : e
        )
      });
      sync.emitLocalUpdate(id, 'Rejected');
    },
    addEnrollment(enrollment: Partial<Enrollment>): void {
      api.saveEnrollment(enrollment).subscribe(newEntity => {
        patchState(store, {
          entities: [newEntity, ...store.entities()]
        });
      });
    }
  }))
);