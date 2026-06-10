import express from 'express';

const app = express();

app.use(express.json());

app.get('/health', (_, res) => {
  return res.status(200).json({
    status: 'UP',
    service: 'users-service',
  });
});

export default app;