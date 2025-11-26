import { UserRole, UserStatus } from "../../domain/models/user.model";

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  metadata?: Record<string, unknown> | Map<string, unknown>;
}
