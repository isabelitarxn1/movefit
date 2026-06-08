import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logOutOutline,
  personCircleOutline,
  createOutline,
  saveOutline,
  closeOutline,
  calendarOutline,
  barbellOutline,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { RoutineRepository } from '../../services/routine.repository';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule],
})
export class PerfilPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly routineRepo = inject(RoutineRepository);

  /** Usuario autenticado actual (datos para mostrar en el perfil). */
  readonly user = this.auth.currentUser;

  // Estados de edición
  readonly isEditing = signal(false);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  // Variables temporales para el formulario
  editFullName = '';
  editWeightKg: number | null = null;
  editHeightCm: number | null = null;

  // Estadísticas del usuario
  readonly routineCount = signal(0);

  /** Calcula el Índice de Masa Corporal (IMC). */
  readonly imc = computed(() => {
    const u = this.user();
    if (!u || !u.weightKg || !u.heightCm) {
      return null;
    }
    const heightM = u.heightCm / 100;
    return (u.weightKg / (heightM * heightM)).toFixed(1);
  });

  /** Clasifica el IMC en español. */
  readonly imcCategory = computed(() => {
    const score = this.imc();
    if (!score) {
      return '';
    }
    const val = parseFloat(score);
    if (val < 18.5) {
      return 'Bajo peso';
    }
    if (val < 25) {
      return 'Peso normal';
    }
    if (val < 30) {
      return 'Sobrepeso';
    }
    return 'Obesidad';
  });

  /** Formatea la fecha de creación de la cuenta de manera legible. */
  readonly memberSince = computed(() => {
    const u = this.user();
    if (!u || !u.createdAt) {
      return '';
    }
    try {
      const date = new Date(u.createdAt);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  });

  constructor() {
    addIcons({
      logOutOutline,
      personCircleOutline,
      createOutline,
      saveOutline,
      closeOutline,
      calendarOutline,
      barbellOutline,
    });
  }

  /** Se ejecuta automáticamente al ingresar a la vista de perfil en Ionic. */
  async ionViewWillEnter(): Promise<void> {
    const current = this.user();
    if (current) {
      try {
        const routines = await this.routineRepo.findByUser(current.id);
        this.routineCount.set(routines.length);
      } catch (err) {
        console.error('Error al cargar cantidad de rutinas:', err);
      }
    }
  }

  /** Activa el modo edición copiando los valores actuales de la sesión. */
  toggleEdit(): void {
    const current = this.user();
    if (current) {
      this.editFullName = current.fullName;
      this.editWeightKg = current.weightKg;
      this.editHeightCm = current.heightCm;
      this.error.set(null);
      this.isEditing.set(true);
    }
  }

  /** Cancela el modo edición y limpia errores. */
  cancelEdit(): void {
    this.isEditing.set(false);
    this.error.set(null);
  }

  /** Valida y guarda los cambios en el perfil de usuario. */
  async saveProfile(): Promise<void> {
    this.error.set(null);
    this.loading.set(true);

    const result = await this.auth.updateProfile(
      this.editFullName,
      this.editWeightKg ?? 0,
      this.editHeightCm ?? 0
    );

    this.loading.set(false);

    if (result.ok) {
      this.isEditing.set(false);
    } else {
      this.error.set(result.error ?? 'No se pudo guardar los cambios.');
    }
  }

  /** Cierra la sesión y regresa a la pantalla de login. */
  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

