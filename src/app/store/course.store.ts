import {inject } from '@angular/core';
import {signalStore, withMethods, patchState, withState} from '@ngrx/signals';
import {removeEntity, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { catchError, EMPTY } from 'rxjs';
import { Course } from '../models/course.model';
import {CourseService } from '../services/course';

 export const CourseStore = signalStore(
    {providedIn: 'root'},
    withState({error: null as string|null }),
    withEntities<Course>(),
    withMethods((store, svc= inject(CourseService)) => ({
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
)