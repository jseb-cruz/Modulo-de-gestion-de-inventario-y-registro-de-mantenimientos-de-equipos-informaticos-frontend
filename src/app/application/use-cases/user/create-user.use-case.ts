import { inject, Injectable } from '@angular/core';
import { User } from '../../../domain/models/user.model';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserDTO } from '../../../shared/contracts/user.contract';

@Injectable({ providedIn: 'root' })
export class CreateUserUseCase {
  private readonly repo = inject(UserRepository);
  async execute(input: Omit<UserDTO, 'id'> & { password: string }): Promise<User> {
    return this.repo.create(input);
  }
}
