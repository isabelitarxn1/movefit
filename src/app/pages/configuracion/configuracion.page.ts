import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  notificationsOffOutline,
  alarmOutline,
  addOutline,
  saveOutline,
  closeOutline,
  createOutline,
  trashOutline,
  timeOutline,
  calendarOutline,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { ReminderRepository } from '../../services/reminder.repository';
import { NotificationService } from '../../services/notification.service';
import { DayOfWeek, DAYS_OF_WEEK } from '../../models/routine.model';
import { Reminder } from '../../models/reminder.model';

/**
 * Pantalla de Ajustes: gestión de recordatorios y notificaciones (RF08).
 *
 * Cada cambio sobre los recordatorios (crear, editar, activar/desactivar,
 * borrar) se persiste en SQLite y luego se reprograma en el sistema operativo
 * a través de NotificationService.
 */
@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, FormsModule],
})
export class ConfiguracionPage {
  private readonly auth = inject(AuthService);
  private readonly reminderRepo = inject(ReminderRepository);
  private readonly notifications = inject(NotificationService);

  /** Recordatorios del usuario. */
  readonly reminders = signal<Reminder[]>([]);

  /** Si el permiso de notificaciones del SO está concedido. */
  readonly permissionGranted = signal(false);

  // Estados de UI
  readonly isFormOpen = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  /** Catálogo de días para el selector circular. */
  readonly days = DAYS_OF_WEEK;

  // Variables enlazadas al formulario de crear/editar recordatorio
  title = '';
  message = '';
  time = '08:00';
  selectedDays: DayOfWeek[] = [];
  enabled = true;

  constructor() {
    addIcons({
      notificationsOutline,
      notificationsOffOutline,
      alarmOutline,
      addOutline,
      saveOutline,
      closeOutline,
      createOutline,
      trashOutline,
      timeOutline,
      calendarOutline,
    });
  }

  /** Carga los recordatorios y el estado del permiso al entrar a la vista. */
  async ionViewWillEnter(): Promise<void> {
    const current = this.auth.currentUser();
    if (!current) {
      return;
    }
    try {
      this.permissionGranted.set(await this.notifications.hasPermission());
      this.reminders.set(await this.reminderRepo.findByUser(current.id));
    } catch (err) {
      console.error('Error al cargar la configuración:', err);
    }
  }

  /** Solicita permiso al SO y, si se concede, reprograma lo ya existente. */
  async enableNotifications(): Promise<void> {
    const granted = await this.notifications.requestPermission();
    this.permissionGranted.set(granted);
    if (granted) {
      await this.notifications.sync(this.reminders());
    }
  }

  /** Abre el formulario en modo "crear", con valores por defecto. */
  openCreateForm(): void {
    this.editingId.set(null);
    this.title = '';
    this.message = '';
    this.time = '08:00';
    this.selectedDays = [];
    this.enabled = true;
    this.error.set(null);
    this.isFormOpen.set(true);
  }

  /** Abre el formulario en modo "editar", precargando un recordatorio. */
  openEditForm(reminder: Reminder): void {
    this.editingId.set(reminder.id);
    this.title = reminder.title;
    this.message = reminder.message;
    this.time = reminder.time;
    this.selectedDays = [...reminder.days];
    this.enabled = reminder.enabled;
    this.error.set(null);
    this.isFormOpen.set(true);
  }

  /** Cierra el formulario sin guardar. */
  closeForm(): void {
    this.isFormOpen.set(false);
    this.error.set(null);
  }

  toggleDay(code: DayOfWeek): void {
    const i = this.selectedDays.indexOf(code);
    if (i >= 0) {
      this.selectedDays.splice(i, 1);
    } else {
      this.selectedDays.push(code);
    }
  }

  isDaySelected(code: DayOfWeek): boolean {
    return this.selectedDays.includes(code);
  }

  /** Valida y guarda (crea o actualiza) el recordatorio. */
  async saveReminder(): Promise<void> {
    this.error.set(null);
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      this.error.set('No hay una sesión activa.');
      return;
    }

    if (!this.title.trim()) {
      this.error.set('Escribe un título para el recordatorio.');
      return;
    }
    if (!this.time) {
      this.error.set('Selecciona una hora.');
      return;
    }
    if (this.selectedDays.length === 0) {
      this.error.set('Selecciona al menos un día de la semana.');
      return;
    }

    this.loading.set(true);
    try {
      const input = {
        title: this.title,
        message: this.message,
        time: this.time,
        days: this.selectedDays,
        enabled: this.enabled,
      };

      const editing = this.editingId();
      if (editing !== null) {
        await this.reminderRepo.update(editing, input);
      } else {
        await this.reminderRepo.create(userId, input);
      }

      await this.reloadAndSync(userId);
      this.isFormOpen.set(false);
    } catch (err: any) {
      this.error.set(err.message || 'No se pudo guardar el recordatorio.');
    } finally {
      this.loading.set(false);
    }
  }

  /** Activa o desactiva un recordatorio desde la lista. */
  async toggleReminderEnabled(reminder: Reminder): Promise<void> {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      return;
    }
    try {
      await this.reminderRepo.setEnabled(reminder.id, !reminder.enabled);
      await this.reloadAndSync(userId);
    } catch (err) {
      console.error('Error al cambiar el estado del recordatorio:', err);
    }
  }

  /** Elimina un recordatorio previa confirmación. */
  async deleteReminder(reminder: Reminder): Promise<void> {
    if (!confirm(`¿Eliminar el recordatorio "${reminder.title}"?`)) {
      return;
    }
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      return;
    }
    try {
      await this.reminderRepo.deleteById(reminder.id);
      await this.reloadAndSync(userId);
    } catch (err) {
      console.error('Error al eliminar el recordatorio:', err);
    }
  }

  /** Devuelve las abreviaturas de los días de un recordatorio ("Lun · Mié"). */
  formatDays(days: DayOfWeek[]): string {
    return DAYS_OF_WEEK.filter((d) => days.includes(d.code))
      .map((d) => d.label)
      .join(' · ');
  }

  /** Recarga la lista desde la BD y reprograma las notificaciones del SO. */
  private async reloadAndSync(userId: number): Promise<void> {
    const fresh = await this.reminderRepo.findByUser(userId);
    this.reminders.set(fresh);
    if (this.permissionGranted()) {
      await this.notifications.sync(fresh);
    }
  }
}
