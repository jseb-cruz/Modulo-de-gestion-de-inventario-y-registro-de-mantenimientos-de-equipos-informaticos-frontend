import { inject, Injectable } from '@angular/core';
import { Location } from '../../../domain/models/location.model';
import { LocationDTO } from '../../../shared/contracts/location.contract';
import { LocationRepository } from '../../../domain/repositories/location.repository';

@Injectable( {
 providedIn: 'root'
} )
export class UpdateLocationUseCase {
 private readonly repo = inject( LocationRepository );
 async execute ( id: string, input: Partial<LocationDTO> ): Promise<Location> {
 return this.repo.update( id, input );
 }
}
