import { inject, Injectable } from '@angular/core';
import { User } from '../../../domain/models/user.model';
import { UserDTO } from '../../../shared/contracts/user.contract';
import { UserRepository } from '../../../domain/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class UpdateUserUseCase {
  private readonly repo = inject(UserRepository);
  async execute(id: string, input: Partial<UserDTO> & { password?: string }): Promise<User> {
    return this.repo.update(id, input);
  }
}
