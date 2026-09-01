import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";
import { mockBackendInterceptor } from "./interceptors/mock-backend.interceptor";
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from "./interceptors/jwt.interceptors";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from './app.routes';

export const appconfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([mockBackendInterceptor, credentialsInterceptor, jwtInterceptor, errorInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    )
  ]
};