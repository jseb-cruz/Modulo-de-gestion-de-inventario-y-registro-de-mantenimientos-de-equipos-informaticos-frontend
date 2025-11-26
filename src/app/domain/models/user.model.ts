export type UserRole = 'Admin' | 'User';
export type UserStatus = 'Active' | 'Inactive';

export interface UserProps {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  metadata?: Record<string, unknown> | Map<string, unknown>;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly metadata: Map<string, unknown> = new Map(),
  ) { }

  static create(props: UserProps): User {
    const meta = props.metadata instanceof Map
      ? props.metadata
      : new Map(Object.entries(props.metadata ?? {}));
    return new User(
      props.id,
      props.email,
      props.name,
      props.role ?? 'User',
      props.status ?? 'Active',
      meta,
    );
  }

  isActive(): boolean {
    return this.status === 'Active';
  }
}
