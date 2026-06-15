import { Router } from 'express';

import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireManager } from '../middlewares/roleMiddleware';

const router = Router();

const userController = new UserController();

router.get('/users', authMiddleware, requireManager, (req, res) => userController.findAll(req, res),
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

router.delete('/users/:userId', (req, res) =>
  userController.delete(req, res),
);

router.put('/users/:userId/roles', (req, res) =>
  userController.updateRoles(req, res),
);

export default router;