import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'rutinas',
        loadComponent: () =>
          import('../pages/rutinas/rutinas.page').then((m) => m.RutinasPage),
      },
      {
        path: 'progreso',
        loadComponent: () =>
          import('../pages/progreso/progreso.page').then((m) => m.ProgresoPage),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('../pages/perfil/perfil.page').then((m) => m.PerfilPage),
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('../pages/configuracion/configuracion.page').then(
            (m) => m.ConfiguracionPage
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
