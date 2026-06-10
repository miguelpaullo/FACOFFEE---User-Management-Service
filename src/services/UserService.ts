import { CreateUserDto } from '../dtos/CreateUserDto';

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
}
