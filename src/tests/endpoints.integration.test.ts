import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockUserService } = vi.hoisted(() => {
  return {
    mockUserService: {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateRoles: vi.fn(),
    },
  };
});

vi.mock('../services/UserService', () => {
  return {
    UserService: class {
      create = mockUserService.create;
      findAll = mockUserService.findAll;
      findById = mockUserService.findById;
      update = mockUserService.update;
      delete = mockUserService.delete;
      updateRoles = mockUserService.updateRoles;
    },
  };
});
import app from '../app';

describe('Integração dos endpoints do Users Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve responder o health check do Users Service', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'UP',
      service: 'users-service',
    });
  });

  it('deve criar usuário em POST /users', async () => {
    const payload = {
      name: 'Usuario Teste',
      email: 'teste@facom.ufms.br',
      roles: ['PARTICIPANT'],
    };

    const createdUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Usuario Teste',
      email: 'teste@facom.ufms.br',
      status: 'ACTIVE',
      createdAt: '2026-06-15T00:00:00.000Z',
      updatedAt: '2026-06-15T00:00:00.000Z',
      deactivatedAt: null,
      roles: [
        {
          id: 'role_001',
          userId: 'usr_001',
          role: 'PARTICIPANT',
        },
      ],
    };

    mockUserService.create.mockResolvedValue(createdUser);

    const response = await request(app)
      .post('/users')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdUser);
    expect(mockUserService.create).toHaveBeenCalledWith(payload);
  });

  it('deve retornar conflito ao criar usuário com e-mail já existente', async () => {
    const payload = {
      name: 'Usuario Teste',
      email: 'teste@facom.ufms.br',
      roles: ['PARTICIPANT'],
    };

    mockUserService.create.mockRejectedValue(
      new Error('EMAIL_ALREADY_EXISTS'),
    );

    const response = await request(app)
      .post('/users')
      .send(payload);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: 'EMAIL_JA_ESTÁ_EM_USO',
    });
  });

  it('deve listar usuários em GET /users', async () => {
    const users = [
      {
        id: 'usr_001',
        keycloakId: 'keycloak_001',
        name: 'Maria Silva',
        email: 'maria@email.com',
        status: 'ACTIVE',
        createdAt: '2026-06-15T00:00:00.000Z',
        updatedAt: '2026-06-15T00:00:00.000Z',
        deactivatedAt: null,
        roles: [
          {
            id: 'role_001',
            userId: 'usr_001',
            role: 'PARTICIPANT',
          },
        ],
      },
    ];

    mockUserService.findAll.mockResolvedValue(users);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('deve buscar usuário por id em GET /users/:userId', async () => {
    const user = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: 'ACTIVE',
      createdAt: '2026-06-15T00:00:00.000Z',
      updatedAt: '2026-06-15T00:00:00.000Z',
      deactivatedAt: null,
      roles: [
        {
          id: 'role_001',
          userId: 'usr_001',
          role: 'PARTICIPANT',
        },
      ],
    };

    mockUserService.findById.mockResolvedValue(user);

    const response = await request(app).get('/users/usr_001');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
    expect(mockUserService.findById).toHaveBeenCalledWith('usr_001');
  });

  it('deve atualizar usuário em PATCH /users/:userId', async () => {
    const payload = {
      name: 'Maria Atualizada',
    };

    const updatedUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Atualizada',
      email: 'maria@email.com',
      status: 'ACTIVE',
      createdAt: '2026-06-15T00:00:00.000Z',
      updatedAt: '2026-06-15T01:00:00.000Z',
      deactivatedAt: null,
    };

    mockUserService.update.mockResolvedValue(updatedUser);

    const response = await request(app)
      .patch('/users/usr_001')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedUser);
    expect(mockUserService.update).toHaveBeenCalledWith(
      'usr_001',
      payload,
    );
  });

  it('deve desativar usuário em DELETE /users/:userId', async () => {
    const deletedUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: 'INACTIVE',
      createdAt: '2026-06-15T00:00:00.000Z',
      updatedAt: '2026-06-15T01:00:00.000Z',
      deactivatedAt: '2026-06-15T01:00:00.000Z',
    };

    mockUserService.delete.mockResolvedValue(deletedUser);

    const response = await request(app).delete('/users/usr_001');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(deletedUser);
    expect(mockUserService.delete).toHaveBeenCalledWith('usr_001');
  });

  it('deve atualizar papéis do usuário em PUT /users/:userId/roles', async () => {
    const payload = {
      roles: ['MANAGER'],
    };

    const updatedUser = {
      id: 'usr_001',
      keycloakId: 'keycloak_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
      status: 'ACTIVE',
      createdAt: '2026-06-15T00:00:00.000Z',
      updatedAt: '2026-06-15T01:00:00.000Z',
      deactivatedAt: null,
      roles: [
        {
          id: 'role_002',
          userId: 'usr_001',
          role: 'MANAGER',
        },
      ],
    };

    mockUserService.updateRoles.mockResolvedValue(updatedUser);

    const response = await request(app)
      .put('/users/usr_001/roles')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedUser);
    expect(mockUserService.updateRoles).toHaveBeenCalledWith(
      'usr_001',
      payload,
    );
  });
});