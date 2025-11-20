import { inject, Injectable } from '@angular/core';
import { Location } from '../../../domain/models/location.model';
import { LocationRepository } from '../../../domain/repositories/location.repository';

@Injectable({
  providedIn: 'root'
})
export class FindLocationByIdUseCase {
  private readonly repo = inject(LocationRepository);
  async execute(id: string): Promise<Location | null> {
    return this.repo.findById(id);
  }
}
