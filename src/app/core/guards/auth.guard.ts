import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ⭐ INTERVIEW QUESTION: "What is a Route Guard?"
// Answer: Guards protect routes from unauthorized access
// If user is not logged in and tries to visit /dashboard
// The guard redirects them to /login automatically
// Without guards, anyone could access protected pages just by typing the URL
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};