import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UpdateUserRolesDto } from '../dtos/UpdateUserRolesDto';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});

const prisma = new PrismaClient({
  adapter,
});

export class UserService {
  async create(data: CreateUserDto) {
    const role = (data.roles?.[0] ?? 'PARTICIPANT') as 'MANAGER' | 'PARTICIPANT';

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        roles: role,
      },
    });

    return user;
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async update(userId: string, data: UpdateUserDto) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  async delete(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'INACTIVE',
        deactivatedAt: new Date(),
      },
    });
  }

  async updateRoles(userId: string, data: UpdateUserRolesDto) {
    const role = (data.roles?.[0] ?? 'PARTICIPANT') as 'MANAGER' | 'PARTICIPANT';

    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        roles: role,
      },
    });
  }
}