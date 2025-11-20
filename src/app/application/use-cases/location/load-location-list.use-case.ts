import { inject, Injectable } from '@angular/core';
import { LocationRepository } from '../../../domain/repositories/location.repository';
import { Location } from '../../../domain/models/location.model';

@Injectable({ providedIn: 'root' })
export class LoadLocationListUseCase {
  private readonly repo = inject(LocationRepository);

  async execute(): Promise<Location[]> {
    return this.repo.findAll();
  }
}
