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

  private toPayload(input: Partial<EquipmentDTO>): Partial<EquipmentDTO> {
    const copy: any = { ...input };
    delete copy.id; // backend genera id
    if (copy.metadata instanceof Map) {
      copy.metadata = Object.fromEntries(copy.metadata);
    }
    if (copy.purchaseDate instanceof Date) copy.purchaseDate = copy.purchaseDate.toISOString();
    if (copy.warrantyEnd instanceof Date) copy.warrantyEnd = copy.warrantyEnd.toISOString();
    return copy;
  }

  private unwrapOne(response: { ok?: boolean; data?: EquipmentDTO } | EquipmentDTO | null | undefined): EquipmentDTO | null {
    if (!response) return null;
    return (response as any).data ?? response ?? null;
  }

  private unwrapList(response: { ok?: boolean; data?: EquipmentDTO[] } | EquipmentDTO[] | null | undefined): EquipmentDTO[] {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray((response as any).data)) return (response as any).data;
    return [];
  }

  async findAll(): Promise<Equipment[]> {
    const response = await firstValueFrom(this.http.get<{ "ok"?: boolean, data?: EquipmentDTO[] } | EquipmentDTO[]>('equipment'));
    const list = this.unwrapList(response);
    return list.map(Equipment.create);
  }
  async findById(id: string): Promise<Equipment | null> {
    const response = await firstValueFrom(this.http.get<{ "ok"?: boolean, data?: EquipmentDTO } | EquipmentDTO>(`equipment/${id}`));
    const dto = this.unwrapOne(response);
    return dto ? Equipment.create(dto) : null;
  }
  async create(input: EquipmentDTO): Promise<Equipment> {
    const payload = this.toPayload(input);
    const response = await firstValueFrom(this.http.post<{ "ok"?: boolean, data?: EquipmentDTO } | EquipmentDTO>('equipment', payload));
    const dto = this.unwrapOne(response)!;
    return Equipment.create(dto);
  }
  async update(id: string, patch: Partial<EquipmentDTO>): Promise<Equipment> {
    const payload = this.toPayload(patch);
    const response = await firstValueFrom(this.http.patch<{ "ok"?: boolean, data?: EquipmentDTO } | EquipmentDTO>(`equipment/${id}`, payload));
    const dto = this.unwrapOne(response)!;
    return Equipment.create(dto);
  }
  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<{ ok: boolean }>(`equipment/${id}`));
  }
}


