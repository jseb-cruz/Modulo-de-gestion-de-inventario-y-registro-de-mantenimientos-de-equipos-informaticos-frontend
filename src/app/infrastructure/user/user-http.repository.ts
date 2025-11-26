import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/models/user.model";
import { UserDTO } from "../../shared/contracts/user.contract";

@Injectable({ providedIn: 'root' })
export class UserHttpRepository implements UserRepository {
  private readonly http = inject(HttpClient);

  private unwrapList(response: { ok?: boolean; data?: UserDTO[] } | UserDTO[] | null | undefined): UserDTO[] {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray((response as any).data)) return (response as any).data;
    return [];
  }

  private unwrapOne(response: { ok?: boolean; data?: UserDTO } | UserDTO | null | undefined): UserDTO | null {
    if (!response) return null;
    return (response as any).data ?? response ?? null;
  }

  async findAll(): Promise<User[]> {
    const response = await firstValueFrom(this.http.get<{ ok?: boolean; data?: UserDTO[] } | UserDTO[]>('users'));
    return this.unwrapList(response).map(User.create);
  }

  async findById(id: string): Promise<User | null> {
    const response = await firstValueFrom(this.http.get<{ ok?: boolean; data?: UserDTO } | UserDTO>(`users/${id}`));
    const dto = this.unwrapOne(response);
    return dto ? User.create(dto) : null;
  }

  async create(input: Omit<UserDTO, 'id'> & { password: string }): Promise<User> {
    const response = await firstValueFrom(this.http.post<{ ok?: boolean; data?: UserDTO } | UserDTO>('users', input));
    const dto = this.unwrapOne(response);
    return User.create(dto!);
  }

  async update(id: string, input: Partial<UserDTO> & { password?: string }): Promise<User> {
    const response = await firstValueFrom(this.http.patch<{ ok?: boolean; data?: UserDTO } | UserDTO>(`users/${id}`, input));
    const dto = this.unwrapOne(response);
    return User.create(dto!);
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<{ ok?: boolean }>(`users/${id}`));
  }
}
