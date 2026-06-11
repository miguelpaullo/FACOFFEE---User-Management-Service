import { Injectable } from '@nestjs/common';
import { PrismaClient, User, Role, Prisma } from '../generated/prisma';

import { PrismaClient } from '../generated/prisma';

export const prisma = new PrismaClient();
@Injectable()
export class UserRepository {
  
  async create(data: { name: string; email: string; roles: Role[] }): Promise<User> {
    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          roles: {
            create: data.roles.map(role => ({ role }))
          }
        },
        include: { roles: true }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('EMAIL_ALREADY_EXISTS');
        }
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { roles: true }
    });
  }

  async updateRoles(userId: string, newRoles: Role[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({
        where: { userId }
      });

      await tx.userRole.createMany({
        data: newRoles.map(role => ({
          userId,
          role
        }))
      });
    });
  }

  async softDelete(userId: string): Promise<User> {
    try {
      return await prisma.user.update({
        where: { 
          id: userId,
          status: 'ACTIVE'
        },
        data: {
          status: 'INACTIVE',
          deactivatedAt: new Date()
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new Error('USER_NOT_FOUND_OR_INACTIVE');
      }
      throw error;
    }
  }
}