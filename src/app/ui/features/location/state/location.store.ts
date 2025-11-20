import { inject, Injectable, signal } from '@angular/core';
import { LoadLocationListUseCase } from '../../../../application/use-cases/location/load-location-list.use-case';
import { Location } from '../../../../domain/models/location.model';
@Injectable( {
 providedIn: 'root'
} )
export class LocationStore {
 private readonly loadList = inject( LoadLocationListUseCase );
 readonly items = signal<Location[]>( [] );
 readonly loading = signal( false );
 readonly error = signal<string | null>( null );
 async fetchAll () {
 this.loading.set( true );
 this.error.set( null );
 try {
 const data = await this.loadList.execute();
 this.items.set( data );
 } catch ( err: any ) {
 this.error.set( err?.message ?? 'Unexpected error' );
 } finally {
 this.loading.set( false );
 }
 }
}