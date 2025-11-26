import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../../../domain/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class RemoveUserUseCase {
  private readonly repo = inject(UserRepository);
  async execute(id: string): Promise<void> {
    return this.repo.remove(id);
  }
}
