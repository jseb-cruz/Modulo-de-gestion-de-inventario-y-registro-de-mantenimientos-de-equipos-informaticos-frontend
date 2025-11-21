import { Injectable } from '@angular/core';
import { LocationRepository } from '../../domain/repositories/location.repository';
import { Location } from '../../domain/models/location.model';
import { LocationDTO } from '../../shared/contracts/location.contract';

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

  async create(input: LocationDTO): Promise<Location> {
    await new Promise(r => setTimeout(r, 200));
    const entity = Location.create(input);
    this.data = [entity, ...this.data];
    return entity;
  }
  async update(id: string, patch: Partial<LocationDTO>): Promise<Location> {
    await new Promise(r => setTimeout(r, 200));
    const idx = this.data.findIndex(e => e.id === id);
    if (idx < 0) throw new Error('Location not found');
    const current = this.data[idx];
    const merged: LocationDTO = {
      id: current.id,
      code: patch.code ?? current.code,
      name: patch.name ?? current.name,
      type: patch.type ?? current.type,
      status: patch.status ?? current.status,
      building: patch.building ?? current.building,
      floor: patch.floor ?? current.floor,
      room: patch.room ?? current.room,
      address: patch.address ?? current.address,
      metadata: (patch.metadata as any) ?? current.metadata,
    };
    const updated = Location.create(merged);
    this.data[idx] = updated;
    return updated;
  }
  async remove(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    this.data = this.data.filter(e => e.id !== id);
  }
}
