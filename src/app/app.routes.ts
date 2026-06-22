import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'requests/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/requests/create-request/create-request.component')
        .then(m => m.CreateRequestComponent)
  },
  {
    path: 'requests/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/requests/request-detail/request-detail.component')
        .then(m => m.RequestDetailComponent)
  },
  {
    path: 'requests',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/requests/request-list/request-list.component')
        .then(m => m.RequestListComponent)
  },
  {
    path: 'sessions/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/create-session/create-session.component')
        .then(m => m.CreateSessionComponent)
  },
  {
    path: 'sessions/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/session-detail/session-detail.component')
        .then(m => m.SessionDetailComponent)
  },
  {
    path: 'sessions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/session-list/session-list.component')
        .then(m => m.SessionListComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notifications/notifications.component')
        .then(m => m.NotificationsComponent)
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/chat/chat.component').then(m => m.ChatComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];