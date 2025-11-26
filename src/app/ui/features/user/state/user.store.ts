import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from '../../../../domain/models/user.model';
import { LoadUserListUseCase } from '../../../../application/use-cases/user/load-user-list.use-case';
import { FindUserByIdUseCase } from '../../../../application/use-cases/user/find-user-by-id.use-case';
import { CreateUserUseCase } from '../../../../application/use-cases/user/create-user.use-case';
import { UpdateUserUseCase } from '../../../../application/use-cases/user/update-user.use-case';
import { RemoveUserUseCase } from '../../../../application/use-cases/user/remove-user.use-case';
import { UserDTO } from '../../../../shared/contracts/user.contract';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly loadList = inject(LoadUserListUseCase);
  private readonly findByIdUseCase = inject(FindUserByIdUseCase);
  private readonly createUser = inject(CreateUserUseCase);
  private readonly updateUser = inject(UpdateUserUseCase);
  private readonly removeUser = inject(RemoveUserUseCase);

  readonly items = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly query = signal<string>('');
  readonly role = signal<'All' | 'Admin' | 'User'>('All');
  readonly status = signal<'All' | 'Active' | 'Inactive'>('All');

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    const role = this.role();
    const status = this.status();
    return this.items().filter(u => {
      const byQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const byRole = role === 'All' || u.role === role;
      const byStatus = status === 'All' || u.status === status;
      return byQuery && byRole && byStatus;
    });
  });

  readonly total = signal<number>(0);

  constructor() {
    effect(() => {
      this.total.set(this.filtered().length);
    });
  }

  async fetchAll() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.loadList.execute();
      this.items.set(data);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Unexpected error');
    } finally {
      this.loading.set(false);
    }
  }

  async findById(id: string) {
    const cached = this.items().find(u => u.id === id);
    if (cached) return cached;
    this.loading.set(true);
    this.error.set(null);
    try {
      const found = await this.findByIdUseCase.execute(id);
      if (found) {
        const exists = this.items().some(u => u.id === found.id);
        this.items.set(exists ? this.items().map(u => u.id === found.id ? found : u) : [found, ...this.items()]);
      }
      return found;
    } catch (err: any) {
      this.error.set(err?.message ?? 'No fue posible obtener el usuario');
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  setQuery(v: string) { this.query.set(v); }
  setRole(v: 'All' | 'Admin' | 'User') { this.role.set(v); }
  setStatus(v: 'All' | 'Active' | 'Inactive') { this.status.set(v); }

  async create(input: Omit<UserDTO, 'id'> & { password: string }) {
    this.loading.set(true);
    try {
      const created = await this.createUser.execute(input);
      this.items.set([created, ...this.items()]);
      return created;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: string, input: Partial<UserDTO> & { password?: string }) {
    this.loading.set(true);
    try {
      const updated = await this.updateUser.execute(id, input);
      this.items.set(this.items().map(u => u.id === id ? updated : u));
      return updated;
    } finally {
      this.loading.set(false);
    }
  }

  async remove(id: string) {
    this.loading.set(true);
    try {
      await this.removeUser.execute(id);
      this.items.set(this.items().filter(u => u.id !== id));
    } finally {
      this.loading.set(false);
    }
  }
}
