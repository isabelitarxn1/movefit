import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { firstName } from '../../models/user.model';
import { addIcons } from 'ionicons';
import {
  barbellOutline,
  statsChartOutline,
  personOutline,
  settingsOutline,
  listOutline,
  flameOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

/**
 * Representa un acceso rápido del dashboard de inicio.
 * Cada tarjeta navega a una sección principal de la app (RF09).
 *
 * @property label    Texto visible de la tarjeta (ej: "Mis Rutinas").
 * @property subtitle Descripción corta debajo del título.
 * @property icon     Nombre del icono de ionicons ya registrado en addIcons().
 * @property route    Ruta destino al tocar la tarjeta (ej: "/tabs/rutinas").
 */
interface QuickAction {
  label: string;
  subtitle: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink],
})
export class HomePage {
  private readonly auth = inject(AuthService);


  readonly userName = computed(() => {
    const user = this.auth.currentUser();
    return user ? firstName(user.fullName) : '';
  });

  quickActions: QuickAction[] = [
    {
      label: 'Mi Progreso',
      subtitle: 'Revisa tu historial y estadísticas',
      icon: 'stats-chart-outline',
      route: '/tabs/progreso',
    },
    {
      label: 'Mis Rutinas',
      subtitle: 'Crea y edita tus entrenamientos',
      icon: 'barbell-outline',
      route: '/tabs/rutinas',
    },
    {
      label: 'Perfil',
      subtitle: 'Tus datos y objetivos físicos',
      icon: 'person-outline',
      route: '/tabs/perfil',
    },
    {
      label: 'Ajustes',
      subtitle: 'Recordatorios y notificaciones',
      icon: 'settings-outline',
      route: '/tabs/configuracion',
    },
  ];

  constructor() {
    addIcons({
      barbellOutline,
      statsChartOutline,
      personOutline,
      settingsOutline,
      listOutline,
      flameOutline,
      chevronForwardOutline,
    });
  }
}
