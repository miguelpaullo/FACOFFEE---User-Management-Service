import { Role } from '../generated/prisma';

export interface UpdateUserRolesDto {
  roles: Role[];
}