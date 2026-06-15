import { PrismaClient, Role } from '../generated/prisma';

const prisma = new PrismaClient();

export class UserRepository {

  async create(data: {name: string; email: string; keycloakId: string; roles: Role[];}) {
    return prisma.user.create({
      data: {
        keycloakId: data.keycloakId,
        name: data.name,
        email: data.email,
        roles: {
          create: data.roles.map(role => ({
            role,
          })),
        },
      },
      include: {
        roles: true,
      },
    });
  }

  async findAll() {
    return prisma.user.findMany({
      include: {
        roles: true,
      },
    });
  }

  async findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        roles: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });
  }

  async update(userId: string, data: {
    name?: string;
    email?: string;
    keycloakId?: string;
  },
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      email: data.email,
      keycloakId: data.keycloakId,
    },
  });
}

  async softDelete(userId: string) {
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

  async updateRoles(
    userId: string,
    roles: Role[],
    ) {

  await prisma.userRole.deleteMany({
    where: {
      userId,
    },
  });

  await prisma.userRole.createMany({
    data: roles.map(role => ({
      userId,
      role,
    })),
  });

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      roles: true,
    },
  });
}
}