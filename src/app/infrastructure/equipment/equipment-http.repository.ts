import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Equipment } from '../../domain/models/equipment.model';
import { EquipmentDTO } from '../../shared/contracts/equipment.contract';
import { EquipmentRepository } from
  '../../domain/repositories/equipment.repository';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EquipmentHttpRepository implements EquipmentRepository {
  private readonly http = inject(HttpClient);

  async findAll(): Promise<Equipment[]> {
    const response = await firstValueFrom(this.http.get<{"ok":boolean,data:EquipmentDTO[]}>('equipment'));
    const data = response.data
    const list = Array.isArray(data) ? data : [];
    return list.map(Equipment.create);
  }
  async findById(id: string): Promise<Equipment | null> {
    const dto = await firstValueFrom(this.http.get<EquipmentDTO>(`equipment/${id}`));
    return dto ? Equipment.create(dto) : null;
  }
  async create(input: EquipmentDTO): Promise<Equipment> {
    const dto = await this.http.post<EquipmentDTO>('equipment', input
    ).toPromise();
    return Equipment.create(dto!);
  }
  async update(id: string, patch: Partial<EquipmentDTO>): Promise<Equipment> {
    const dto = await this.http.patch<EquipmentDTO>(`equipment/${id}`, patch
    ).toPromise();
    return Equipment.create(dto!);
  }
  async remove(id: string): Promise<void> {
    await this.http.delete<void>(`equipment/${id}`).toPromise();
  }
}


