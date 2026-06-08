import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// ⭐ INTERVIEW QUESTION: "What is an HTTP Interceptor?"
// Answer: An interceptor sits between every HTTP request and the server
// It automatically adds the JWT token to every request's Authorization header
// Without this, you'd have to manually add the token to every API call
// It also handles 401 errors globally — if token expires, redirect to login
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // clone the request and add Authorization header
  // ⭐ INTERVIEW: Why clone? HTTP requests are immutable in Angular
  // You can't modify them directly, must clone and modify the clone
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      // if token expired or invalid → redirect to login
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};