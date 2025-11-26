import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Location } from "../../domain/models/location.model";
import { LocationDTO } from "../../shared/contracts/location.contract";
import { LocationRepository } from "../../domain/repositories/location.repository";
import { firstValueFrom } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class LocationHttpRepository implements LocationRepository {
  private readonly http = inject(HttpClient);

  private toPayload(input: Partial<LocationDTO>): Partial<LocationDTO> {
    const copy: any = { ...input };
    // El backend suele generar el id; no enviamos uno desde el cliente
    delete copy.id;
    if (copy.metadata instanceof Map) {
      copy.metadata = Object.fromEntries(copy.metadata);
    }
    return copy;
  }

  async findAll(): Promise<Location[]> {
    const response = await firstValueFrom(this.http.get<{ "ok": boolean, data: LocationDTO[] }>('location'));
    const data = response.data
    const list = Array.isArray(data) ? data : [];
    return list.map(Location.create)

  }
  async findById(id: string): Promise<Location | null> {
    const response = await firstValueFrom(this.http.get<{ "ok": boolean, data: LocationDTO }>(`location/${id}`));
    const dto = response?.data;
    return dto ? Location.create(dto) : null;
  }
  async create(input: LocationDTO): Promise<Location> {
    const payload = this.toPayload(input);
    const response = await firstValueFrom(this.http.post<{ "ok": boolean, data: LocationDTO }>('location', payload));
    const dto = response?.data;
    return Location.create(dto!);
  }
  async update(id: string, patch: Partial<LocationDTO>): Promise<Location> {
    const payload = this.toPayload(patch);
    const response = await firstValueFrom(this.http.patch<{ "ok": boolean, data: LocationDTO }>(`location/${id}`, payload));
    const dto = response?.data;
    return Location.create(dto!);
  }
  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<{ "ok": boolean }>(`location/${id}`));
  }
}
