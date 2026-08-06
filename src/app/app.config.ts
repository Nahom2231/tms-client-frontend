import { ApplicationConfig, provideZoneChangeDetection} from "@angular/core";
import { provideRouter, withComponentInputBinding} from "@angular/router";
import { provideHttpClient} from "@angular/common/http";
import {routes} from "./app.routes";
import {provideAnimations } from '@angular/platform-browser/animations';

export const appconfig: ApplicationConfig ={
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimations()
  ]
};