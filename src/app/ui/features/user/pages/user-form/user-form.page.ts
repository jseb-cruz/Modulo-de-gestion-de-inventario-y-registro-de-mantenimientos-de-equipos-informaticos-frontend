import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserStore } from '../../state/user.store';
import { UserDTO } from '../../../../../shared/contracts/user.contract';
import { User } from '../../../../../domain/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.css']
})
export class UserFormPage {
  private fb = inject(FormBuilder);
  private store = inject(UserStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = this.store.loading;
  error = signal<string | null>(null);
  isEdit = false;
  id = '';

  form = this.fb.group({
    id: this.fb.control<string>(''),
    email: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    role: this.fb.control<'Admin' | 'User'>('User', { nonNullable: true }),
    status: this.fb.control<'Active' | 'Inactive'>('Active', { nonNullable: true }),
    password: this.fb.control<string>('', { nonNullable: false, validators: [] }),
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.id) {
      this.isEdit = true;
      this.store.findById(this.id).then((u) => {
        if (u) this.patchUser(u);
      });
    }
  }

  patchUser(u: User) {
    this.form.patchValue({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      status: u.status,
      password: '',
    });
  }

  async onSubmit() {
    this.error.set(null);
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    try {
      if (this.isEdit) {
        const patch: Partial<UserDTO> & { password?: string } = {
          email: raw.email,
          name: raw.name,
          role: raw.role,
          status: raw.status,
        };
        if (raw.password?.trim()) patch.password = raw.password.trim();
        await this.store.update(this.id, patch);
      } else {
        const input: Omit<UserDTO, 'id'> & { password: string } = {
          email: raw.email,
          name: raw.name,
          role: raw.role,
          status: raw.status,
          password: raw.password?.trim() ?? '',
        };
        await this.store.create(input);
      }
      this.router.navigate(['/users']);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Error al guardar');
    }
  }
}
