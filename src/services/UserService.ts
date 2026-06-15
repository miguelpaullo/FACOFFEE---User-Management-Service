import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UpdateUserRolesDto } from '../dtos/UpdateUserRolesDto';
import { UserDeactivatedPublisher } from '../events/UserDeactivatedPublisher';
import { UserRepository } from '../repositories/UserRepository';
import { Role } from '../generated/prisma';

export class UserService {

    private readonly userRepository = new UserRepository();

  async create(data: CreateUserDto) {
    console.log(data);

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

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
        return this.getUserOrThrow(userId);
}

    async update(userId: string, data: UpdateUserDto) {

        await this.getUserOrThrow(userId);
        return this.userRepository.update(userId, data);
}

    async delete(userId: string) {

        const user = await this.getUserOrThrow(userId,);

        if (user.status === 'INACTIVE') {
            throw new Error('USER_ALREADY_INACTIVE',);
        }

        const deletedUser = await this.userRepository.softDelete(userId,);

        const publisher = new UserDeactivatedPublisher();

        await publisher.publish(userId, 'Usuário desativado manualmente',);

        return deletedUser;
    }

    

    async updateRoles(userId: string, data: UpdateUserRolesDto,) {

        const validRoles = Object.values(Role);

        const invalidRoles = data.roles.filter(role => !validRoles.includes(role as Role),);

        if (invalidRoles.length > 0) {
            throw new Error('INVALID_ROLE');
        }

        await this.getUserOrThrow(userId,);

        return this.userRepository.updateRoles(userId, data.roles as any,);
    }


    private async getUserOrThrow(userId: string) {

        const user = await this.userRepository.findById(userId,);

        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

    return user;
}

}
