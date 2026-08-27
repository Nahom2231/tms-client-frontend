import { LiveSyncService } from './../services/live-sync';
import { inject, computed } from '@angular/core';
import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';
import { tap, concatMap, catchError, EMPTY,switchMap, pipe } from 'rxjs';
import { signalStore, withState, withComputed, patchState, withMethods } from '@ngrx/signals';
import { rxMethod} from '@ngrx/signals/rxjs-interop';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  withState({
    isLoading: false,
    error: null as string | null,
    entities: [{ Id: '101', studentName: 'Dawit Alemayehu', courseTitle: 'Advanced Java Services', status: 'Pending' },
      { Id: '102', studentName: 'Abebe Kebede', courseTitle: 'Database Design', status: 'Pending' }] as unknown as Enrollment[],
  }),
  withComputed((store) => ({
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === 'Pending').length
    ),
  })),
  withMethods((store, api = inject(EnrollmentService),
      sync= inject(LiveSyncService)) => ({
       seed(items: any[]) {
      patchState(store, { entities: items });
    }, 
      listenForLiveUpdates: rxMethod<void>(
      pipe(
      tap(()=>sync.connect()),
      switchMap(()=> sync.events$),
       tap(event => {
      patchState(store, {
       entities: store.entities().map( e=>
        e.Id === event.id ? { ...e, status: event.status } : e

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
       sync.emitLocalUpdate(id, 'Approved');
      /*api.approve(id)
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
        .subscribe();*/
    },
  }))
);