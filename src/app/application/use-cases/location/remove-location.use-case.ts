import { inject, Injectable } from '@angular/core';
import { LocationRepository } from '../../../domain/repositories/location.repository';
@Injectable({
  providedIn: 'root'
})
export class RemoveLocationUseCase {
  private readonly repo = inject(LocationRepository);
  async execute(id: string): Promise<void> {
    this.repo.remove(id);
  }
}
