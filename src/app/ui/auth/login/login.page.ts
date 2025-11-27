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
  template: `
  <section class="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-4xl grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center">
      <div class="space-y-6">
        <div class="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
          <span class="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.2)]"></span>
          Tech Inventory
        </div>
        <div class="space-y-2">
          <h1 class="text-3xl md:text-4xl font-semibold leading-tight text-white">
            Control total de equipos y mantenimientos.
          </h1>
          <p class="text-slate-300 max-w-2xl">
            Centraliza inventario, ubicaciones y mantenimientos en un solo panel. Inicia sesion para continuar con tu gestion.
          </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-3 text-sm text-slate-200">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur break-words">
            <p class="text-xs uppercase tracking-[0.2em] text-emerald-200">Equipos</p>
            <p class="text-2xl font-semibold text-white">Listo</p>
            <p class="text-xs text-slate-300">Para registrar y controlar</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur break-words">
            <p class="text-xs uppercase tracking-[0.12em] text-emerald-200">Mantenimiento</p>
            <p class="text-2xl font-semibold text-white">Al dia</p>
            <p class="text-xs text-slate-300">Preventivos y correctivos</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur break-words">
            <p class="text-xs uppercase tracking-[0.2em] text-emerald-200">Seguridad</p>
            <p class="text-2xl font-semibold text-white">JWT</p>
            <p class="text-xs text-slate-300">Sesiones seguras</p>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-emerald-400/40 via-cyan-400/30 to-indigo-400/30 blur-2xl opacity-70"></div>
        <div class="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div class="mb-6">
            <p class="text-sm text-slate-300">Accede a tu cuenta</p>
            <h2 class="text-xl font-semibold text-white">Iniciar sesion</h2>
          </div>

          <form class="space-y-5" [formGroup]="form" (ngSubmit)="onSubmit()">
            <label class="block space-y-2 text-sm font-medium text-slate-100">
              Correo
              <input
                formControlName="email"
                type="email"
                placeholder="admin@empresa.com"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 disabled:opacity-60"
              >
            </label>

            <label class="block space-y-2 text-sm font-medium text-slate-100">
              Contrasena
              <input
                formControlName="password"
                type="password"
                placeholder="•••••••"
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 disabled:opacity-60"
              >
            </label>

            @if(error()){
            <p class="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {{ error() }}
            </p>
            }

            <div class="space-y-3">
              <button
                type="submit"
                [disabled]="loading() || form.invalid"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-emerald-500/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                @if(loading()){
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></span>
                <span>Ingresando...</span>
                } @else {
                <span>Ingresar</span>
                }
              </button>
              <p class="text-center text-xs text-slate-300">
                Solo personal autorizado. Si olvidaste tu clave, solicita un reset al admin.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `,
  styleUrls: []
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
