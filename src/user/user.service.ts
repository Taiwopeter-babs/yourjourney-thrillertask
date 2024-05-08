import { Injectable } from '@nestjs/common';

import {
  CreateUserDto,
  UpdateUserDto,
  UserRoleDto,
} from './dto/createUser.dto';

import { IPagination, PagedItemDto } from '../lib/types';

import User from './user.entity';
import DtoMapper from '../lib/mapper';
import UserDto from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private repo: UserRepository) {}

  public async getManyUsers(pageParams: IPagination): Promise<PagedItemDto> {
    return (await this.repo.getPagedUsers(pageParams)) as PagedItemDto;
  }

  public async getUser(userId: number): Promise<UserDto> {
    const user = (await this.repo.getUser(userId)) as User;
    console.log(user);
    return DtoMapper.toUserDto(user, true);
  }

  public async getUserByEmail(email: string): Promise<UserDto> {
    return (await this.repo.getUserByEmail(email)) as User;
  }

  public async createUser(user: CreateUserDto) {
    const newUser = (await this.repo.createUser(user)) as User;

    return DtoMapper.toUserDto(newUser) as UserDto;
  }

  public async updateUser(userId: number, data: UpdateUserDto) {
    const isUpdated = await this.repo.updateUser(userId, data);

    return isUpdated ? true : false;
  }

  public async updateUserRoles(userId: number, data: UserRoleDto) {
    const roleIsUpdated = await this.repo.updateUserRoles(userId, data);

    return roleIsUpdated ? true : false;
  }

  public async deleteUser(userId: number) {
    const isDeleted = await this.repo.deleteUser(userId);

    return isDeleted ? true : false;
  }
}
