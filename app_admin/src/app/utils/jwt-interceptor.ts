import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { Authentication } from '../services/authentication';

// Attaches "Authorization: Bearer <token>" to every outgoing API request
// while the admin is logged in, so the secured POST/PUT/DELETE trip
// endpoints accept the call. The login and register calls are skipped -
// they are how the token is obtained in the first place.
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authentication = inject(Authentication);
  const isAuthAPI = req.url.endsWith('/login') || req.url.endsWith('/register');

  if (authentication.isLoggedIn() && !isAuthAPI) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authentication.getToken()}`
      }
    });
    return next(authReq);
  }
  return next(req);
};
