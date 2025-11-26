import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/models/user.model';

@Injectable({ providedIn: 'root' })
export class FindUserByIdUseCase {
  private readonly repo = inject(UserRepository);
  async execute(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }
}
