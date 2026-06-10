import express from 'express';
import { authMiddleware } from './middlewares/authMiddleware';
import { publishDomainEvent } from './integrations/rabbitmq/eventPublisher';

import userRoutes from './routes/User.routes';

import { swaggerUi, swaggerDocument } from './config/swagger';

const app = express();

app.use(express.json());

app.get('/health', (_, res) => {
  return res.status(200).json({
    status: 'UP',
    service: 'users-service',
  });
});

app.use(userRoutes);

app.get('/debug/protected', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'Rota protegida acessada com sucesso.',
    authenticatedUser: (req as any).authenticatedUser,
  });
});

app.post('/debug/events/user-created', authMiddleware, async (req, res) => {
  try {
    const event = await publishDomainEvent('users.created', {
      user: req.body,
      requestedBy: (req as any).authenticatedUser,
    });

    return res.status(202).json({
      message: 'Evento de usuário publicado no RabbitMQ.',
      event,
    });
  } catch (error) {
    return res.status(503).json({
      error: 'rabbitmq_publish_failed',
      message: 'Não foi possível publicar o evento no RabbitMQ.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

export default app;