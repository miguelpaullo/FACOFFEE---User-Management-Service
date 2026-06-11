import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../app';

describe('Integração dos endpoints de usuários', () => {
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

    const response = await request(app)
      .post('/users')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'User endpoint configured',
      receivedData: payload,
    });
  });

  it('deve listar usuários em GET /users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 'usr_001',
        name: 'Maria Silva',
        email: 'maria@email.com',
      },
    ]);
  });

  it('deve buscar usuário por id em GET /users/:userId', async () => {
    const response = await request(app).get('/users/usr_001');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'usr_001',
      name: 'Maria Silva',
      email: 'maria@email.com',
    });
  });

  it('deve atualizar usuário em PATCH /users/:userId', async () => {
    const payload = {
      name: 'Maria Atualizada',
    };

    const response = await request(app)
      .patch('/users/usr_001')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'usr_001',
      data: payload,
      message: 'User updated successfully',
    });
  });

  it('deve desativar usuário em DELETE /users/:userId', async () => {
    const response = await request(app).delete('/users/usr_001');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'usr_001',
      message: 'User deactivated successfully',
    });
  });

  it('deve atualizar papéis do usuário em PUT /users/:userId/roles', async () => {
    const payload = {
      roles: ['MANAGER'],
    };

    const response = await request(app)
      .put('/users/usr_001/roles')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'usr_001',
      roles: ['MANAGER'],
      message: 'User roles updated successfully',
    });
  });
});