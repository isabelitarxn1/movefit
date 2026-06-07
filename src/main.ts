import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAppInitializer, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements as defineJeepSqlite } from 'jeep-sqlite/loader';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { DatabaseService } from './app/services/database.service';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules)),
      // Inicializa la base de datos SQLite antes de mostrar la app.
      provideAppInitializer(() => inject(DatabaseService).initialize()),
    ],
  });

// Registra el web component jeep-sqlite (necesario para SQLite en navegador).
defineJeepSqlite(window);

if (Capacitor.getPlatform() === 'web') {
  // En navegador hay que tener el elemento <jeep-sqlite> en el DOM y definido
  // antes de inicializar el almacén web, así que esperamos a eso para arrancar.
  window.addEventListener('DOMContentLoaded', async () => {
    const jeepEl = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepEl);
    await customElements.whenDefined('jeep-sqlite');
    bootstrap();
  });
} else {
  bootstrap();
}
