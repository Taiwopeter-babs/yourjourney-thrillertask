import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';

import errorHandler from 'src/exceptions/errorHandler';
import { UserService } from '../user/user.service';
import User from 'src/user/user.entity';
import { WrongCredentialsException } from '../exceptions/badRequest';

import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { ITokenPayload, TEntity } from '../lib/types';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Injectable()
export class AuthService {
  // This can accomodate other entities
  // The TEntity would alsoo have to be modified
  private entityTypes: string[] = ['User'];

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** salt rounds to hash password with */
  private saltRounds = 10;

  public async validateUser(email: string, password: string) {
    try {
      const user = (await this.userService.getUserByEmail(email)) as User;

      console.log(user);

      const isPasswordMatching = await this.verifyPassword(
        password,
        user.password,
      );

      if (!isPasswordMatching) {
        throw new WrongCredentialsException();
      }

      return user;
    } catch (error) {
      errorHandler(error);
    }
  }

  public async getJwtData(
    entityType: TEntity,
    email: string,
  ): Promise<User | undefined> {
    let entity: User;

    try {
      if (this.entityTypes.indexOf(entityType) === -1) {
        throw new UnauthorizedException(
          `Entity with the email: ${email}, is invalid`,
        );
      }

      entity = (await this.userService.getUserByEmail(email)) as User;

      return entity;
    } catch (error) {
      errorHandler(error);
    }
  }

  /**
   * Signs and returns an access token and cookie options for session
   */
  public async loginUser<T extends User>(user: T, entityType: TEntity) {
    const payload: ITokenPayload = {
      email: user.email,
      entityType: entityType,
      sub: user.id,
    };

    const validTime = this.configService.get('JWT_VALID_TIME') as string;
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    const jwtSignOptions: JwtSignOptions = {
      expiresIn: parseInt(validTime, 10),
      secret: jwtSecret,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      jwtSignOptions,
    );

    const cookieOptions: CookieOptions = {
      maxAge: parseInt(validTime, 10) * 1000,
      httpOnly: true,
    };

    return [cookieOptions, accessToken];
  }

  /**
   * ### verifies a password
   */
  private async verifyPassword(password: string, hash: string) {
    try {
      const isVerified = await bcrypt.compare(password, hash);
      return isVerified;
    } catch (error) {
      errorHandler(error);
    }
  }

  /**
   * ### hashes a user password
   */
  public async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      errorHandler(error);
    }
  }

  public async registerUser(user: CreateUserDto) {
    try {
      const { password } = user;

      user.password = (await this.hashPassword(password)) as string;

      console.log(user);

      return this.userService.createUser(user);
    } catch (error) {
      console.error(error);
      errorHandler(error);
    }
  }
}
