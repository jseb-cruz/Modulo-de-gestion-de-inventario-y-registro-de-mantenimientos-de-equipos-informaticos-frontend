import { Injectable } from '@angular/core';
import { LocationRepository } from '../../domain/repositories/location.repository';
import { Location } from '../../domain/models/location.model';

const seed: Location[] = [
  new Location(
    'LOC-01',
    'HQ-BOG',
    'Sede Principal',
    'Office',
    'Active',
    'Edificio A',
    '5',
    '502',
    'Cra 10 #20-30, Bogota',
    new Map<string, unknown>([['capacity', 50], ['areaM2', 320]])
  ),
  new Location(
    'LOC-02',
    'WARE-001',
    'Bodega Central',
    'Warehouse',
    'Active',
    'Bodega 3',
    '1',
    'Carga',
    'Zona Industrial, Bogota',
    new Map<string, unknown>([['tempControlled', true]])
  ),
];

@Injectable({ providedIn: 'root' })
export class LocationFakeRepository implements LocationRepository {
  private data = [...seed];

  async findAll(): Promise<Location[]> {
    // Simula latencia basica
    await new Promise(r => setTimeout(r, 300));
    return this.data;
  }

  async findById(id: string): Promise<Location | null> {
    await new Promise(r => setTimeout(r, 200));
    return this.data.find(l => l.id === id) ?? null;
  }
}
