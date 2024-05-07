import { FindManyOptions, Repository } from 'typeorm';
import User from './user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UserRoleDto,
} from './dto/createUser.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import DtoMapper from '../lib/mapper';
import UserDto from './dto/user.dto';

import errorHandler from '../exceptions/errorHandler';
import { UserAlreadyExistsException } from '../exceptions/badRequest';
import { UserNotFoundException } from '../exceptions/notFound';

import { IPagination, PagedItemDto } from 'src/lib/types';
import getPaginationOffset from '../lib/pagination';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  public async getUser(userId: number): Promise<User> {
    return (await this.getUserEntity(userId)) as User;
  }

  public async getPagedUsers(
    pageParams: IPagination,
  ): Promise<PagedItemDto | void> {
    try {
      const pageOffset = getPaginationOffset(pageParams);

      const paginationOptions: FindManyOptions<User> = {
        skip: pageOffset,
        take: pageParams.pageSize,
        order: { firstName: 'ASC' },
      };

      const [itemsCount, interns] = await Promise.all([
        // items count
        await this.repo.count(),
        // data
        await this.repo.find({ ...paginationOptions }),
      ]);

      const totalPages = Math.ceil(itemsCount / pageParams.pageSize);

      const data: PagedItemDto = {
        entities: interns.map((user) => DtoMapper.toUserDto(user)),
        currentPage: pageParams.pageNumber,
        pageSize: pageParams.pageSize,
        totalPages: totalPages,
        totalItems: itemsCount,
        hasNext: pageParams.pageNumber < totalPages,
        hasPrevious: pageParams.pageNumber > 1,
      };

      return data;
    } catch (error) {
      errorHandler(error);
    }
  }

  public async getUserByEmail(email: string): Promise<User | void> {
    try {
      const user = await this.repo.findOne({
        where: { email: email },
      });

      if (!user) {
        throw new UserNotFoundException(email);
      }

      return user;
    } catch (error) {
      errorHandler(error);
    }
  }

  public async createUser(user: CreateUserDto) {
    try {
      await this.checkUserExists(user.email);

      const newUser = await this.repo.save(user as User);

      return DtoMapper.toUserDto(newUser) as UserDto;
    } catch (error) {
      //   console.error(error);
      errorHandler(error);
    }
  }

  public async updateUser(userId: number, data: UpdateUserDto) {
    try {
      await this.getUserEntity(userId);

      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        phone: data.phone,
      };

      await this.repo.update(userId, { ...updateData } as User);

      return true;
    } catch (error) {
      errorHandler(error);
    }
  }

  public async updateUserRoles(userId: number, data: UserRoleDto) {
    try {
      await this.getUserEntity(userId);

      await this.repo.update(userId, { roles: data.role });

      return true;
    } catch (error) {
      errorHandler(error);
    }
  }

  public async deleteUser(userId: number) {
    (await this.getUserEntity(userId)) as User;

    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id: userId })
        .execute();

      return true;
    } catch (error) {
      errorHandler(error);
    }
  }

  private async checkUserExists(email: string): Promise<void> {
    try {
      const intern = await this.repo.findOne({
        select: { id: true, email: true },
        // or query
        where: { email: email.toLowerCase() },
      });

      if (intern) {
        throw new UserAlreadyExistsException(email);
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  private async getUserEntity(userId: number): Promise<User | void> {
    try {
      const user = await this.repo.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new UserNotFoundException(userId);
      }

      return user;
    } catch (error) {
      errorHandler(error);
    }
  }
}
