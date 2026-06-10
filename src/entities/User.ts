export type UserRole =
  | 'MANAGER'
  | 'PARTICIPANT';

export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;

  status: UserStatus;

  roles: UserRole[];

  createdAt: Date;
  updatedAt?: Date;
  deactivatedAt?: Date;
}