export interface CreateUserDto {
  name: string;
  email: string;
  roles?: Array<'MANAGER' | 'PARTICIPANT'>;
}