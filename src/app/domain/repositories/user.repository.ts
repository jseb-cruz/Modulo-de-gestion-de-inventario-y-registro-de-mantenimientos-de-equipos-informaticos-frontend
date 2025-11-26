import { User } from "../models/user.model";
import { UserDTO } from "../../shared/contracts/user.contract";

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract create(input: Omit<UserDTO, 'id'> & { password: string }): Promise<User>;
  abstract update(id: string, input: Partial<UserDTO> & { password?: string }): Promise<User>;
  abstract remove(id: string): Promise<void>;
}
