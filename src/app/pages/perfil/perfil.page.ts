import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon],
})
export class PerfilPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Usuario autenticado actual (datos para mostrar en el perfil). */
  readonly user = this.auth.currentUser;

  constructor() {
    addIcons({ logOutOutline, personCircleOutline });
  }

  /** Cierra la sesión y regresa a la pantalla de login. */
  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
