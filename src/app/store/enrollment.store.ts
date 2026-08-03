import { inject, computed } from '@angular/core';
import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';
import { tap, concatMap, catchError, EMPTY } from 'rxjs';
import { signalStore, withState, withComputed, patchState, withMethods } from '@ngrx/signals';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({
    isLoading: false,
    error: null as string | null,
    entities: [] as Enrollment[],
  }),
  withComputed((store) => ({
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === 'Pending').length
    ),
  })),
  withMethods((store, api = inject(EnrollmentService)) => ({
    loadEnrollments(): void {
      patchState(store, { isLoading: true, error: null });
      api.getAll()
        .pipe(
          tap((entities) => patchState(store, { entities, isLoading: false })),
          catchError((err) => {
            patchState(store, { isLoading: false, error: 'Failed to load enrollments.' });
            return EMPTY;
          })
        )
        .subscribe();
    },

    approveEnrollment(id: string): void {
      patchState(store, {
        entities: store.entities().map((e) =>
          e.Id === id ? { ...e, status: 'Approved' } : e
        ),
      });
      api.approve(id)
        .pipe(
          catchError(() => {
            patchState(store, {
              entities: store.entities().map((e) =>
                e.Id === id ? { ...e, status: 'Pending' } : e
              ),
              error: 'Server rejected the approval. Check enrollment constraints.',
            });
            return EMPTY;
          })
        )
        .subscribe();
    },
  }))
);