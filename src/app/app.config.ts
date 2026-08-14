import { ApplicationConfig } from "@angular/core";
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";
import {credentialsInterceptor} from './interceptors/credentials.interceptor'

export const appconfig: ApplicationConfig ={
  providers: [
    provideHttpClient(
      withInterceptors([credentialsInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })

    )
    
  ]
};