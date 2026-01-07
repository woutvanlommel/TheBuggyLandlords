import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Beveiligt routes waarvoor je ingelogd moet zijn.
 * Als je niet bent ingelogd, wordt je teruggestuurd naar /login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check of er een token is (dus ingelogd)
  if (authService.getToken()) {
    return true;
  }

  // Niet ingelogd? Redirect naar login pagina
  return router.createUrlTree(['/login']);
};
