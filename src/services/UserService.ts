import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UpdateUserRolesDto } from '../dtos/UpdateUserRolesDto';
import { UserDeactivatedPublisher } from '../events/UserDeactivatedPublisher';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {

    private readonly userRepository = new UserRepository();

  async create(data: CreateUserDto) {
    console.log(data);
    return this.userRepository.create({
        name: data.name,
        email: data.email,
        roles: data.roles ?? ['PARTICIPANT'],
        });
}

  async findAll() {
    return this.userRepository.findAll();
}

    async findById(userId: string) {
        return this.userRepository.findById(userId);
}

    async update(userId: string, data: UpdateUserDto) {
        return this.userRepository.update(userId, data);
}

    async delete(userId: string) {
        const user = await this.userRepository.softDelete(userId);

        const publisher = new UserDeactivatedPublisher();

        await publisher.publish(
            userId,
            'Usuário desativado manualmente',
  );

  return user;
}

    async updateRoles(userId: string, data: UpdateUserRolesDto,) {

    return this.userRepository.updateRoles(
        userId,
        data.roles as any,
    );
}

}
