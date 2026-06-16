import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockUserRepository,
  mockKeycloakService,
  mockUserDeactivatedPublisher,
} = vi.hoisted(() => {
  return {
    mockUserRepository: {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
      updateRoles: vi.fn(),
    },
    mockKeycloakService: {
      createUser: vi.fn(),
      updateRoles: vi.fn(),
    },
    mockUserDeactivatedPublisher: {
      publish: vi.fn(),
    },
  };
});

vi.mock('../repositories/UserRepository', () => {
  return {
    UserRepository: class {
      create = mockUserRepository.create;
      findAll = mockUserRepository.findAll;
      findById = mockUserRepository.findById;
      findByEmail = mockUserRepository.findByEmail;
      update = mockUserRepository.update;
      softDelete = mockUserRepository.softDelete;
      updateRoles = mockUserRepository.updateRoles;
    },
  };
});

vi.mock('../services/KeycloakService', () => {
  return {
    KeycloakService: class {
      createUser = mockKeycloakService.createUser;
      updateRoles = mockKeycloakService.updateRoles;
    },
  };
});

vi.mock('../events/UserDeactivatedPublisher', () => {
  return {
    UserDeactivatedPublisher: class {
      publish = mockUserDeactivatedPublisher.publish;
    },
  };
});

vi.mock('../generated/prisma', () => {
  return {
    Role: {
      MANAGER: 'MANAGER',
      PARTICIPANT: 'PARTICIPANT',
    },
  };
});

import { UserService } from '../services/UserService';

describe('UserService - regras de negócio', () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService();
  });

  it('deve criar usuário com role padrão PARTICIPANT quando nenhuma role for informada', async () => {
    const payload = {
      name: 'Usuario Teste',
      email: 'teste@facom.ufms.br',
    };

    const createdUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Usuario Teste',
      email: 'teste@facom.ufms.br',
      status: 'ACTIVE',
      roles: [
        {
          role: 'PARTICIPANT',
        },
      ],
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockKeycloakService.createUser.mockResolvedValue('keycloak_001');
    mockUserRepository.create.mockResolvedValue(createdUser);

    const result = await userService.create(payload);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'teste@facom.ufms.br',
    );

    expect(mockKeycloakService.createUser).toHaveBeenCalledWith(
      'Usuario Teste',
      'teste@facom.ufms.br',
    );

    expect(mockUserRepository.create).toHaveBeenCalledWith({
      keycloakId: 'keycloak_001',
      name: 'Usuario Teste',
      email: 'teste@facom.ufms.br',
      roles: ['PARTICIPANT'],
    });

    expect(result).toEqual(createdUser);
  });

  it('deve lançar erro ao tentar criar usuário com e-mail já existente', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: 'usr_001',
      email: 'teste@facom.ufms.br',
    });

    await expect(
      userService.create({
        name: 'Usuario Teste',
        email: 'teste@facom.ufms.br',
      }),
    ).rejects.toThrow('EMAIL_ALREADY_EXISTS');

    expect(mockKeycloakService.createUser).not.toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('deve listar usuários', async () => {
    const users = [
      {
        id: 'usr_001',
        name: 'Maria Silva',
        email: 'maria@email.com',
      },
    ];

    mockUserRepository.findAll.mockResolvedValue(users);

    const result = await userService.findAll();

    expect(result).toEqual(users);
    expect(mockUserRepository.findAll).toHaveBeenCalled();
  });

  it('deve buscar usuário por id quando ele existir', async () => {
    const user = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: 'ACTIVE',
    };

    mockUserRepository.findById.mockResolvedValue(user);

    const result = await userService.findById('usr_001');

    expect(result).toEqual(user);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('usr_001');
  });

  it('deve lançar USER_NOT_FOUND ao buscar usuário inexistente', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      userService.findById('usr_inexistente'),
    ).rejects.toThrow('USER_NOT_FOUND');
  });

  it('deve atualizar usuário existente', async () => {
    const existingUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: 'ACTIVE',
    };

    const updatedUser = {
      ...existingUser,
      name: 'Maria Atualizada',
    };

    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await userService.update('usr_001', {
      name: 'Maria Atualizada',
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith('usr_001');

    expect(mockUserRepository.update).toHaveBeenCalledWith(
      'usr_001',
      {
        name: 'Maria Atualizada',
      },
    );

    expect(result).toEqual(updatedUser);
  });

  it('deve desativar usuário ativo e publicar evento de desativação', async () => {
    const activeUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: 'ACTIVE',
    };

    const deletedUser = {
      ...activeUser,
      status: 'INACTIVE',
      deactivatedAt: new Date('2026-06-15T00:00:00.000Z'),
    };

    mockUserRepository.findById.mockResolvedValue(activeUser);
    mockUserRepository.softDelete.mockResolvedValue(deletedUser);
    mockUserDeactivatedPublisher.publish.mockResolvedValue(undefined);

    const result = await userService.delete('usr_001');

    expect(mockUserRepository.findById).toHaveBeenCalledWith('usr_001');
    expect(mockUserRepository.softDelete).toHaveBeenCalledWith('usr_001');

    expect(mockUserDeactivatedPublisher.publish).toHaveBeenCalledWith(
      'usr_001',
      'Usuário desativado manualmente',
    );

    expect(result).toEqual(deletedUser);
  });

  it('deve lançar USER_ALREADY_INACTIVE ao tentar desativar usuário já inativo', async () => {
    const inactiveUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: 'INACTIVE',
    };

    mockUserRepository.findById.mockResolvedValue(inactiveUser);

    await expect(
      userService.delete('usr_001'),
    ).rejects.toThrow('USER_ALREADY_INACTIVE');

    expect(mockUserRepository.softDelete).not.toHaveBeenCalled();
    expect(mockUserDeactivatedPublisher.publish).not.toHaveBeenCalled();
  });

  it('deve atualizar roles quando todas forem válidas', async () => {
    const existingUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: 'ACTIVE',
    };

    const updatedUser = {
      ...existingUser,
      roles: [
        {
          role: 'MANAGER',
        },
      ],
    };

    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.updateRoles.mockResolvedValue(updatedUser);
    mockKeycloakService.updateRoles.mockResolvedValue(undefined);

    const result = await userService.updateRoles('usr_001', {
      roles: ['MANAGER'] as any,
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith('usr_001');

    expect(mockUserRepository.updateRoles).toHaveBeenCalledWith(
      'usr_001',
      ['MANAGER'],
    );

    expect(mockKeycloakService.updateRoles).toHaveBeenCalledWith(
      'keycloak_001',
      ['MANAGER'],
    );

    expect(result).toEqual(updatedUser);
  });

  it('deve lançar INVALID_ROLE quando houver role inválida', async () => {
    await expect(
      userService.updateRoles('usr_001', {
        roles: ['ADMIN'] as any,
      }),
    ).rejects.toThrow('INVALID_ROLE');

    expect(mockUserRepository.findById).not.toHaveBeenCalled();
    expect(mockUserRepository.updateRoles).not.toHaveBeenCalled();
    expect(mockKeycloakService.updateRoles).not.toHaveBeenCalled();
  });
});