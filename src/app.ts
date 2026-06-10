import express from 'express';

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

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

export default app;