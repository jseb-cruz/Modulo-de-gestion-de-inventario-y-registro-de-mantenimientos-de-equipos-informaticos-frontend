import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '../../features/user/state/user.store';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.css'],
})
export class ChangePasswordPage {
  private fb = inject(FormBuilder);
  private store = inject(UserStore);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = this.store.loading;
  error = signal<string | null>(null);
  success = signal<boolean>(false);

  form = this.fb.group({
    newPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    confirmPassword: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
  });

  async onSubmit() {
    this.error.set(null);
    this.success.set(false);
    if (this.form.invalid) return;
    const { newPassword, confirmPassword } = this.form.getRawValue();
    if (newPassword !== confirmPassword) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }
    const user = this.auth.user();
    if (!user) {
      this.error.set('No hay sesión activa');
      return;
    }
    try {
      await this.store.update(user.id, { password: newPassword });
      this.success.set(true);
      this.auth.clear();
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.error.set(err?.message ?? 'No fue posible actualizar la contraseña');
    }
  }
}
