import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Location } from "../../domain/models/location.model";
import { LocationDTO } from "../../shared/contracts/location.contract";
import { LocationRepository } from "../../domain/repositories/location.repository";
import { firstValueFrom } from "rxjs";
import { response } from "express";
@Injectable({
  providedIn: 'root'
})
export class LocationHttpRepository implements LocationRepository {
  private readonly http = inject(HttpClient);


  async findAll(): Promise<Location[]> {
    const response = await firstValueFrom(this.http.get<{ "ok": boolean, data: LocationDTO[] }>('location'));
    const data = response.data
    const list = Array.isArray(data) ? data : [];
    return list.map(Location.create)

  }
  async findById(id: string): Promise<Location | null> {
    const dto = await firstValueFrom(this.http.get<LocationDTO>(`location/${id}`))
    return dto ? Location.create(dto) : null;
  }
  async create(input: LocationDTO): Promise<Location> {
    const dto = await this.http.post<LocationDTO>('location', input
    ).toPromise();
    return Location.create(dto!);
  }
  async update(id: string, patch: Partial<LocationDTO>): Promise<Location> {
    const dto = await this.http.patch<LocationDTO>(`location/${id}`, patch
    ).toPromise();
    return Location.create(dto!);
  }
  async remove(id: string): Promise<void> {
    await this.http.delete<void>(`location/${id}`).toPromise();
  }
}

