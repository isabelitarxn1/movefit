import { Component, inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private readonly router = inject(Router);

  constructor() {
    // Al navegar, Ionic oculta la página saliente con aria-hidden. Si un
    // elemento queda enfocado dentro de ella (un enlace, un botón), se genera
    // una advertencia de accesibilidad. Soltamos el foco en cada transición.
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => (document.activeElement as HTMLElement | null)?.blur());
  }
}
