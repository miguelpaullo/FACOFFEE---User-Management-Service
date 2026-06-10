import { CreateUserDto } from '../dtos/CreateUserDto';

export class UserService {
  create(data: CreateUserDto) {
    return {
      message: 'User endpoint configured',
      receivedData: data,
    };
  }
}