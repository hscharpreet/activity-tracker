import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);

  return user(auth).pipe(
    take(1),
    map((currentUser) => {
      if (currentUser) {
        // User is logged in, allow access
        return true;
      } else {
        // User not logged in, redirect to /login
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
