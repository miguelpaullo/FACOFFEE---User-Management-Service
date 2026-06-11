import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UpdateUserRolesDto } from '../dtos/UpdateUserRolesDto';
import { UserDeactivatedPublisher } from '../events/UserDeactivatedPublisher';

export class UserService {
  create(data: CreateUserDto) {
    return {
      message: 'User endpoint configured',
      receivedData: data,
    };
  }

  findAll() {
    return [
      {
        id: 'usr_001',
        name: 'Maria Silva',
        email: 'maria@email.com',
      },
    ];
  }

    findById(userId: string) {
    return {
        id: userId,
        name: 'Maria Silva',
        email: 'maria@email.com',
    };
    }

    update(userId: string, data: UpdateUserDto,)   {
        return {
            id: userId,
            data,
            message: 'User updated successfully',
    };
    }

    async delete(userId: string) {
        const publisher = new UserDeactivatedPublisher();

        await publisher.publish(
            userId,
            'Usuário desativado manualmente'
            );

        return {
            id: userId,
            status: 'INACTIVE',
        };
    }

    updateRoles(userId: string, data: UpdateUserRolesDto,) {
        return {
            id: userId,
            roles: data.roles,
            message: 'User roles updated successfully',
    };
    }

}
