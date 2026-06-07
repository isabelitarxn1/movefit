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
        path: 'catalogo',
        loadComponent: () =>
          import('../pages/catalogo/catalogo.page').then((m) => m.CatalogoPage),
      },
      {
        path: 'crear-rutina',
        loadComponent: () =>
          import('../pages/crear-rutina/crear-rutina.page').then(
            (m) => m.CrearRutinaPage
          ),
      },
      {
        path: 'crear-rutina/:id',
        loadComponent: () =>
          import('../pages/crear-rutina/crear-rutina.page').then(
            (m) => m.CrearRutinaPage
          ),
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
