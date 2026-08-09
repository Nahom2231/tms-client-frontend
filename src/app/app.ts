import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EnrollmentStore } from './store/enrollment.store';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`

})
export class App {
  private store = inject(EnrollmentStore);

  ngOnInit() {
    this.store.listenForLiveUpdates();
  }
}
