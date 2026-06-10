import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto } from '../dtos/CreateUserDto';

export class UserController {
  private readonly userService = new UserService();

  create(
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
  ) {
    const result = this.userService.create(req.body);

    return res.status(201).json(result);
  }
}