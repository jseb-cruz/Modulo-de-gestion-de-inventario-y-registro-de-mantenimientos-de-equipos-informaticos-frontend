import { Injectable, signal } from '@angular/core';
import { User } from '../../domain/models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'auth_token';
  private readonly userKey = 'auth_user';
  token = signal<string | null>(null);
  user = signal<User | null>(null);

  // Carga token/usuario persistido al iniciar la app.
  constructor(private router: Router) {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token.set(window.localStorage.getItem(this.key));
      const rawUser = window.localStorage.getItem(this.userKey);
      if (rawUser) {
        try {
          this.user.set(JSON.parse(rawUser));
        } catch {
          this.user.set(null);
        }
      }
    }
  }

  // Guarda sesion en memoria y localStorage.
  setSession(token: string, user: User) {
    this.token.set(token);
    this.user.set(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(this.key, token);
      window.localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  // Limpia la sesion y regresa al login.
  clear() {
    this.token.set(null);
    this.user.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.key);
      window.localStorage.removeItem(this.userKey);
    }
    this.router.navigate(['/login']);
  }

  // Determina si hay token valido en memoria.
  isAuthenticated(): boolean {
    return !!this.token();
  }

  // Verifica si el usuario logueado tiene rol Admin.
  isAdmin(): boolean {
    return this.user()?.role === 'Admin';
  }
}
