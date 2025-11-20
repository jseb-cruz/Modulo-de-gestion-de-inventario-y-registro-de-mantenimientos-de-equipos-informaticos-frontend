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
  async findAll(): Promise<Location[]> {
    const data = await firstValueFrom(this.http.get<LocationDTO[]>('location'));
    return (data ?? []).map(Location.create)
  }
  async findById(id: string): Promise<Location | null> {
    const dto = await firstValueFrom(this.http.get<LocationDTO>(`location/${id}`))
    return dto ? Location.create(dto) : null;
  }
}
