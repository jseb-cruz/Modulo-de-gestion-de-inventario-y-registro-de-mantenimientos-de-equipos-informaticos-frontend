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


  async findAll(): Promise<Maintenance[]> {
    const response = await firstValueFrom(this.http.get<{"ok":boolean,data:MaintenanceDTO[]}>('maintenance'));
    const data = response.data
    const list = Array.isArray(data) ? data : [];
    return list.map(Maintenance.create);
  }


  async findById(id: string): Promise<Maintenance | null> {
    const dto = await firstValueFrom(this.http.get<MaintenanceDTO>(`maintenance/${id}`));
    return dto ? Maintenance.create(dto) : null;
  }
  async create(input: MaintenanceDTO): Promise<Maintenance> {
    const dto = await this.http.post<MaintenanceDTO>('Maintenance', input
    ).toPromise();
    return Maintenance.create(dto!);
  }
  async update(id: string, patch: Partial<MaintenanceDTO>): Promise<Maintenance> {
    const dto = await this.http.patch<MaintenanceDTO>(`Maintenance/${id}`, patch
    ).toPromise();
    return Maintenance.create(dto!);
  }
  async remove(id: string): Promise<void> {
    await this.http.delete<void>(`Maintenance/${id}`).toPromise();
  }
}


