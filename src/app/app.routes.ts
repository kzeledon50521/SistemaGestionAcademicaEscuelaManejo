import { Routes } from '@angular/router';
import { AppLayout } from './layout/app-layout/app-layout';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'aprendices',
        loadComponent: () =>
          import('./pages/aprendices/aprendices').then(m => m.Aprendices)
      },
      {
        path: 'instructores',
        loadComponent: () =>
          import('./pages/instructores/instructores').then(m => m.Instructores)
      },
      {
        path: 'cursos',
        loadComponent: () =>
          import('./pages/cursos/cursos').then(m => m.Cursos)
      },
      {
        path: 'inscripciones',
        loadComponent: () =>
          import('./pages/inscripciones/inscripciones').then(m => m.Inscripciones)
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('./pages/agenda/agenda').then(m => m.Agenda)
      },
      {
        path: 'evaluaciones',
        loadComponent: () =>
          import('./pages/evaluaciones/evaluaciones').then(m => m.Evaluaciones)
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./pages/reportes/reportes').then(m => m.Reportes)
      }
    ]
  }
];