import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);


  const token = sessionStorage.getItem('access_token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const role = payload.role;

  const allowedRoles = route.data?.['roles'];

  if (allowedRoles && !allowedRoles.includes(role)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
