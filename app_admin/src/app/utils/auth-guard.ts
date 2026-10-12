import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { Authentication } from '../services/authentication';

// Keeps logged-out users off the add/edit forms (the API would reject their
// saves anyway) by sending them to the login page instead
export const authGuard: CanActivateFn = () => {
  return inject(Authentication).isLoggedIn() || inject(Router).createUrlTree(['login']);
};
