import { Router } from 'express';

import { UserController } from '../controllers/UserController';

const router = Router();

const userController = new UserController();

router.post('/users', (req, res) =>
  userController.create(req, res),
);

router.get('/users', (req, res) =>
  userController.findAll(req, res),
);

router.get('/users/:userId', (req, res) =>
  userController.findById(req, res),
);

router.patch('/users/:userId', (req, res) =>
  userController.update(req, res),
);

export default router;