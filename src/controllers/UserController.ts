import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UpdateUserRolesDto } from '../dtos/UpdateUserRolesDto';

export class UserController {
  private readonly userService = new UserService();

  async create(
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
  ) {
    const result = await this.userService.create(req.body);

    return res.status(201).json(result);
  }

  async findAll(req: Request, res: Response) {
    const users = await this.userService.findAll();

    return res.status(200).json(users);
  }

  async findById(req: Request<{ userId: string }>, res: Response) {
    const { userId } = req.params;

    const user = await this.userService.findById(userId);

    return res.status(200).json(user);
  }

  async update(
    req: Request<{ userId: string }, {}, UpdateUserDto>,
    res: Response,
  ) {
    const { userId } = req.params;

    const result = await this.userService.update(userId, req.body);

    return res.status(200).json(result);
  }

  async delete(req: Request<{ userId: string }>, res: Response) {
    const { userId } = req.params;

    const result = await this.userService.delete(userId);

    return res.status(200).json(result);
  }

  async updateRoles(
    req: Request<{ userId: string }, {}, UpdateUserRolesDto>,
    res: Response,
  ) {
    const { userId } = req.params;

    const result = await this.userService.updateRoles(userId, req.body);

    return res.status(200).json(result);
  }
}