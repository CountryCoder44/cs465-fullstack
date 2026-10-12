import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './utils/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // makes HttpClient available to the TripData service; the JWT interceptor
    // signs outgoing API requests with the logged-in admin's token
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
