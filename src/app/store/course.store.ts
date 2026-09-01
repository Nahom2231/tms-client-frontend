import { inject } from '@angular/core';
import { signalStore, withMethods, patchState, withState } from '@ngrx/signals';
import { removeEntity, setAllEntities, addEntity, withEntities } from '@ngrx/signals/entities';
import { catchError, EMPTY, tap } from 'rxjs';
import { Course } from '../models/course.model';
import { CourseService, INITIAL_COURSES } from '../services/course';

export const CourseStore = signalStore(
  { providedIn: 'root' },
  withState({ error: null as string | null, isLoading: false }),
  withEntities<Course>(),
  withMethods((store, svc = inject(CourseService)) => ({
    loadAll() {
      patchState(store, { isLoading: true });
      svc.getAll().pipe(
        tap(courses => {
          patchState(store, setAllEntities(courses));
          patchState(store, { isLoading: false });
        }),
        catchError(() => {
          patchState(store, setAllEntities(INITIAL_COURSES));
          patchState(store, { isLoading: false });
          return EMPTY;
        })
      ).subscribe();
    },
    addCourse(courseData: Partial<Course>) {
      svc.create(courseData).subscribe(newCourse => {
        patchState(store, addEntity(newCourse));
      });
    },
    deleteCourse(id: number) {
      const previousSnapshot = store.entities();
      patchState(store, removeEntity(id));

      svc.delete(id).pipe(
        catchError(err => {
          patchState(store, setAllEntities(previousSnapshot));
          patchState(store, {
            error: 'Cannot delete course: active student enrollments exist.'
          });
          return EMPTY;
        })
      ).subscribe();
    }
  }))
);