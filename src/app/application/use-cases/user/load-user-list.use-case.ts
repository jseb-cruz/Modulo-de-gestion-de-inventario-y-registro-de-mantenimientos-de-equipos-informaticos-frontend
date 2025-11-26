import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/models/user.model';

@Injectable({ providedIn: 'root' })
export class LoadUserListUseCase {
  private readonly repo = inject(UserRepository);
  async execute(): Promise<User[]> {
    return this.repo.findAll();
  }
}
