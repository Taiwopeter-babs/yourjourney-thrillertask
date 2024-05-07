import { Role } from '../user.entity';

export default class UserDto {
  public id: number;

  public email: string;

  public password?: string;

  public firstName: string;

  public lastName: string;

  public gender: string;

  public phone: string;

  public createdAt: Date;

  public updatedAt: Date;

  public roles?: Role[];
}
