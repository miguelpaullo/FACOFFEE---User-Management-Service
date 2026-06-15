import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UpdateUserRolesDto } from '../dtos/UpdateUserRolesDto';

export class UserController {
  private readonly userService = new UserService();

  async create(req: Request, res: Response,) {

    try {

      const result = await this.userService.create(req.body,);

      return res.status(201).json(result,);

    }catch (error: any) {

      if (error.message ==='EMAIL_ALREADY_EXISTS') {

        return res.status(409).json({
          error:
            'EMAIL_JA_ESTÁ_EM_USO',
        });

      }

      return res.status(500).json({
        error:
          'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const users = await this.userService.findAll();

    return res.status(200).json(users);
}

  async findById(req: Request<{ userId: string }>, res: Response,) {
  const user = await this.userService.findById(
    req.params.userId,
  );

  return res.status(200).json(user);
}

    async update(req: Request<{ userId: string }, {}, UpdateUserDto>, res: Response,) {
  const result =
    await this.userService.update(
      req.params.userId,
      req.body,
    );

  return res.status(200).json(result);
}

    async delete(
            req: Request<{ userId: string }>,
            res: Response,
            ) {
            const { userId } = req.params;

            const result = await this.userService.delete(
                userId,
            );

  return res.status(200).json(result);
}

    async updateRoles( req: Request<{ userId: string },{},UpdateUserRolesDto>,res: Response,) {

    const result =
        await this.userService.updateRoles(
        req.params.userId,
        req.body,
        );

    return res.status(200).json(result);
    }

}