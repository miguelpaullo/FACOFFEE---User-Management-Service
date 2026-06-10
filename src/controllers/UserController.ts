import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UpdateUserRolesDto } from '../dtos/UpdateUserRolesDto';

export class UserController {
  private readonly userService = new UserService();

  create(
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
  ) {
    const result = this.userService.create(req.body);

    return res.status(201).json(result);
  }

  findAll(req: Request, res: Response) {
    const users = this.userService.findAll();

    return res.status(200).json(users);
  }

  findById(req: Request<{ userId: string }>, res: Response) {
    const { userId } = req.params;

    const user = this.userService.findById(userId);

    return res.status(200).json(user);
    }

    update(req: Request<{ userId: string }, {}, UpdateUserDto>, res: Response,) {
        const { userId } = req.params;

        const result = this.userService.update(
            userId,
            req.body,
        );

        return res.status(200).json(result);
    }

    delete(req: Request<{ userId: string }>, res: Response,) {
        const { userId } = req.params;

        const result = this.userService.delete(userId);

        return res.status(200).json(result);
    }

    updateRoles(req: Request<{ userId: string },{},UpdateUserRolesDto>, res: Response,) {
        const { userId } = req.params;

        const result = this.userService.updateRoles(userId, req.body,);

        return res.status(200).json(result);
    }

}