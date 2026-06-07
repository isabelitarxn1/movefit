import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAppInitializer, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
// Usamos la salida "custom elements" (no el loader lazy), que es compatible con
// el build system de Angular (esbuild). El loader lazy de Stencil falla aquí.
import { defineCustomElement as defineJeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite.js';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { DatabaseService } from './app/services/database.service';
import { ExerciseRepository } from './app/services/exercise.repository';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules)),
      // Inicializa la base de datos SQLite y siembra el catálogo antes de mostrar la app.
      provideAppInitializer(() => {
        const database = inject(DatabaseService);
        const exercises = inject(ExerciseRepository);
        return (async () => {
          await database.initialize();
          await exercises.seedCatalog();
        })();
      }),
    ],
  });

// Registra el web component jeep-sqlite (su elemento ya está en index.html).
defineJeepSqlite();

if (Capacitor.getPlatform() === 'web') {
  // Esperamos a que jeep-sqlite esté definido y haya actualizado su elemento
  // del DOM antes de arrancar (el APP_INITIALIZER abrirá el almacén web).
  window.addEventListener('DOMContentLoaded', async () => {
    await customElements.whenDefined('jeep-sqlite');
    bootstrap();
  });
} else {
  bootstrap();
}
