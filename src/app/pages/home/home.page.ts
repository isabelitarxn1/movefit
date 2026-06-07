import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
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
  /**
   * Nombre del usuario para el saludo.
   * TODO: más adelante vendrá del servicio de autenticación / SQLite (RF02).
   */
  userName = 'Isabel';

  quickActions: QuickAction[] = [
    {
      label: 'Mi Progreso',
      subtitle: 'Revisa tu historial y estadísticas',
      icon: 'statsChartOutline',
      route: '/tabs/progreso',
    },
    {
      label: 'Mis Rutinas',
      subtitle: 'Crea y edita tus entrenamientos',
      icon: 'barbellOutline',
      route: '/tabs/rutinas',
    },
    {
      label: 'Perfil',
      subtitle: 'Tus datos y objetivos físicos',
      icon: 'personOutline',
      route: '/tabs/perfil',
    },
    {
      label: 'Ajustes',
      subtitle: 'Recordatorios y notificaciones',
      icon: 'settingsOutline',
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
