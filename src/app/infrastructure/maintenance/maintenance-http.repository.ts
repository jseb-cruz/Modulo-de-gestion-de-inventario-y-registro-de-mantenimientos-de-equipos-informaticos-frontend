import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Maintenance } from '../../domain/models/maintenance.model';
import { MaintenanceDTO } from '../../shared/contracts/maintenance.contract';
import { MaintenanceRepository } from
  '../../domain/repositories/maintenance.repository';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MaintenanceHttpRepository implements MaintenanceRepository {
  private readonly http = inject(HttpClient);

  private toPayload(input: Partial<MaintenanceDTO>): Partial<MaintenanceDTO> {
    const copy: any = { ...input };
    delete copy.id; // backend genera el id
    if (copy.scheduledAt instanceof Date) copy.scheduledAt = copy.scheduledAt.toISOString();
    if (copy.performedAt instanceof Date) copy.performedAt = copy.performedAt.toISOString();
    return copy;
  }

  private unwrapOne(response: { ok?: boolean; data?: MaintenanceDTO } | MaintenanceDTO | null | undefined): MaintenanceDTO | null {
    if (!response) return null;
    return (response as any).data ?? response ?? null;
  }

  private unwrapList(response: { ok?: boolean; data?: MaintenanceDTO[] } | MaintenanceDTO[] | null | undefined): MaintenanceDTO[] {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray((response as any).data)) return (response as any).data;
    return [];
  }

  async findAll(): Promise<Maintenance[]> {
    const response = await firstValueFrom(this.http.get<{ "ok"?: boolean, data?: MaintenanceDTO[] } | MaintenanceDTO[]>('maintenance'));
    const list = this.unwrapList(response);
    return list.map(Maintenance.create);
  }


  async findById(id: string): Promise<Maintenance | null> {
    const response = await firstValueFrom(this.http.get<{ "ok"?: boolean, data?: MaintenanceDTO } | MaintenanceDTO>(`maintenance/${id}`));
    const dto = this.unwrapOne(response);
    return dto ? Maintenance.create(dto) : null;
  }
  async create(input: MaintenanceDTO): Promise<Maintenance> {
    const payload = this.toPayload(input);
    const response = await firstValueFrom(this.http.post<{ "ok"?: boolean, data?: MaintenanceDTO } | MaintenanceDTO>('maintenance', payload));
    const dto = this.unwrapOne(response)!;
    return Maintenance.create(dto);
  }
  async update(id: string, patch: Partial<MaintenanceDTO>): Promise<Maintenance> {
    const payload = this.toPayload(patch);
    const response = await firstValueFrom(this.http.patch<{ "ok"?: boolean, data?: MaintenanceDTO } | MaintenanceDTO>(`maintenance/${id}`, payload));
    const dto = this.unwrapOne(response)!;
    return Maintenance.create(dto);
  }
  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<{ ok: boolean }>(`maintenance/${id}`));
  }
}


