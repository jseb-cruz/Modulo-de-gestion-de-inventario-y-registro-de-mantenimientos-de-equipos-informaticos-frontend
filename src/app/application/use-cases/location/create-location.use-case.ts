import { inject, Injectable } from '@angular/core';
import { Location } from '../../../domain/models/location.model';
import { LocationRepository } from '../../../domain/repositories/location.repository';
import { LocationDTO } from '../../../shared/contracts/location.contract';

@Injectable( {
 providedIn: 'root'
} )
export class CreateLocationUseCase {
 private readonly repo = inject( LocationRepository );
 async execute ( input: LocationDTO ): Promise<Location> {
 return this.repo.create( input );
 }
}
