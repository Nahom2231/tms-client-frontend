import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";
import {credentialsInterceptor} from './interceptors/credentials.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from "./interceptors/jwt.interceptors";
import { provideRouter } from "@angular/router";
import { routes } from './app.routes';

export const appconfig: ApplicationConfig ={
  providers: [
    provideZoneChangeDetection({eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([credentialsInterceptor, jwtInterceptor, errorInterceptor ]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })

    )
    
  ]
};