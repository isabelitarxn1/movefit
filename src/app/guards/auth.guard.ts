import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege rutas privadas (ej. /tabs): solo deja pasar si hay sesión activa.
 * Si no, redirige a la pantalla de login.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

/**
 * Protege rutas de invitado (login / register): si el usuario YA está
 * autenticado, lo envía al inicio en vez de mostrarle el login otra vez.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? router.createUrlTree(['/tabs/home']) : true;
};
