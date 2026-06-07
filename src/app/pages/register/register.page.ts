import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, RouterLink, FormsModule],
})
export class RegisterPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  weightKg: number | null = null;
  heightCm: number | null = null;

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  constructor() {
    addIcons({ arrowBackOutline });
  }

  async onSubmit(): Promise<void> {
    this.error.set(null);

    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.loading.set(true);

    const result = await this.auth.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      weightKg: this.weightKg,
      heightCm: this.heightCm,
    });

    this.loading.set(false);

    if (result.ok) {
      this.router.navigateByUrl('/tabs/home');
    } else {
      this.error.set(result.error ?? 'No se pudo crear la cuenta.');
    }
  }
}
