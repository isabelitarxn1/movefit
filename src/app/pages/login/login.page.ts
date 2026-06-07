import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, RouterLink, FormsModule],
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  async onSubmit(): Promise<void> {
    this.error.set(null);
    this.loading.set(true);

    const result = await this.auth.login({
      email: this.email,
      password: this.password,
    });

    this.loading.set(false);

    if (result.ok) {
      this.router.navigateByUrl('/tabs/home');
    } else {
      this.error.set(result.error ?? 'No se pudo iniciar sesión.');
    }
  }
}
