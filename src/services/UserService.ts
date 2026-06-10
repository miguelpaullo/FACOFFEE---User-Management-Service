import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';

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
    ...     data,
            message: 'User updated successfully',
    };
    }

    delete(userId: string) {
        return {
            id: userId,
            message: 'User deactivated successfully',
    };
    }

}
