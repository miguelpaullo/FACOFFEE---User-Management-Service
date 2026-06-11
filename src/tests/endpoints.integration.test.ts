import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../app';

describe('Integração dos endpoints', () => {
  it('deve responder o health check do Users Service', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'UP',
      service: 'users-service',
    });
  });

  it('deve bloquear acesso à rota protegida sem Authorization header', async () => {
    const response = await request(app).get('/debug/protected');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('missing_authorization_header');
  });

  it('deve bloquear acesso à rota protegida com formato inválido de Authorization header', async () => {
    const response = await request(app)
      .get('/debug/protected')
      .set('Authorization', 'Token qualquer-coisa');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('invalid_authorization_header');
  });

  it('deve bloquear publicação de evento sem Authorization header', async () => {
    const response = await request(app)
      .post('/debug/events/user-created')
      .send({
        id: 'teste-1',
        name: 'Usuario Teste',
        email: 'teste@facom.ufms.br',
        roles: ['PARTICIPANT'],
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('missing_authorization_header');
  });
});