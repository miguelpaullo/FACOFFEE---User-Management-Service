import express from 'express';
import { authMiddleware } from './middlewares/authMiddleware';

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

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

export default app;