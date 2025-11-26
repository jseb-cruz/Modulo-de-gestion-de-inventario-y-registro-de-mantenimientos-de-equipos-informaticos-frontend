import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { User } from '../../../domain/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', { nonNullable: true, validators: [Validators.required] })
  });

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const raw = this.form.getRawValue();
      const credentials = {
        email: raw.email.trim().toLowerCase(),
        password: raw.password,
      };
      const res = await this.http.post<{ ok?: boolean; data?: { token: string; user?: User } } | { token: string; user?: User }>('auth/login', credentials).toPromise();
      const token = (res as any)?.token ?? (res as any)?.data?.token;
      const user = (res as any)?.user ?? (res as any)?.data?.user;
      if (!token || !user) throw new Error('No token received');
      this.auth.setSession(token, user as User);
      this.router.navigate(['/hub']);
    } catch (err: any) {
      const status = err?.status;
      const msg = (status === 400 || status === 401)
        ? 'Invalid credentials'
        : err?.error?.message ?? err?.message ?? 'Login failed';
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }
}
