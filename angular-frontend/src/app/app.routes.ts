import { Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';
import { RoomDetail } from './pages/room-detail/room-detail';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/dashboard/profile/profile';
import { DashboardStats } from './pages/dashboard/dashboard-stats/dashboard-stats';

export const routes: Routes = [
  // PUBLIEKE ROUTES (Iedereen mag dit zien)
  {
    path: '',
    redirectTo: 'kotcompass/zoekplatform',
    pathMatch: 'full',
  },
  {
    path: 'kotcompass',
    loadComponent: () => import('./pages/kotcompass/kotcompass').then((m) => m.Kotcompass),
    title: 'KotCompass - Zoek je kot',
    children: [
      {
        path: '',
        redirectTo: 'zoekplatform',
        pathMatch: 'full',
      },
      {
        path: 'faq',
        loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq),
        title: 'Veelgestelde vragen',
      },
      {
        path: 'zoekplatform',
        loadComponent: () =>
          import('./pages/zoekplatform/zoekplatform').then((m) => m.Zoekplatform),
        title: 'Zoekplatform',
      },
      {
        path: 'rooms',
        loadComponent: () => import('./pages/rooms/rooms').then((m) => m.Rooms),
        title: 'Alle koten',
      },
      {
        path: 'rooms/:id',
        component: RoomDetail,
        // loadComponent: () => import('./pages/room-detail/room-detail').then((m) => m.RoomDetail),
        title: 'Kot details',
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    title: 'Inloggen',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
    title: 'Registreren',
  },

  // PRIVATE ROUTES (Alleen ingelogde gebruikers en alleen EIGEN data)
  {
    path: 'dashboard',
    canActivate: [authGuard], // Beveiliging: stuurt je terug naar login als je geen token hebt
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Mijn Dashboard',
    // 2. Kinderen (Sub-routes): Erven automatisch de beveiliging van de ouder (dashboard)
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full',
      },
      {
        path: 'stats',
        component: DashboardStats,
      },
    ],
  },

  // FALLBACK (Onbekende URL -> terug naar start)
  { path: '**', redirectTo: 'kotcompass/zoektplatform' },

  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: 'profile', component: Profile },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
];
