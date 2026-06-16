import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUserDto';
import { UpdateUserRolesDto } from '../dtos/UpdateUserRolesDto';
import { UserDeactivatedPublisher } from '../events/UserDeactivatedPublisher';
import { UserRepository } from '../repositories/UserRepository';
import { Role } from '../generated/prisma';
import { KeycloakService } from './KeycloakService';

export class UserService {

    private readonly userRepository = new UserRepository();
    private readonly keycloakService = new KeycloakService();

  async create(data: CreateUserDto) {
    console.log(data);

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const keycloakId = await this.keycloakService.createUser(
      data.name,
      data.email,
    );

    return this.userRepository.create({
        keycloakId,
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

        const user =await this.getUserOrThrow(userId);

        const updatedUser = await this.userRepository.updateRoles(userId, data.roles as any,);

        await this.keycloakService.updateRoles(user.keycloakId, data.roles,);

        return updatedUser;
    }


    private async getUserOrThrow(userId: string) {

        const user = await this.userRepository.findById(userId,);

        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

    return user;
}

}
