import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

import { CreateUserDto } from 'src/user/dto/createUser.dto';

import { AuthService } from './auth.service';
import { UserAuthGuard } from './guards/auth.guard';
import User from 'src/user/user.entity';
import constants from './constants';

import DtoMapper from '../lib/mapper';

import UserDto from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post('users/register')
  public async registerUser(@Body() createUserDto: CreateUserDto) {
    const user = (await this._service.registerUser(createUserDto)) as UserDto;

    return {
      statusCode: HttpStatus.OK,
      message: 'Registration successful',
      ...user,
    };
  }

  @HttpCode(200)
  @UseGuards(UserAuthGuard)
  @Post('users/login')
  public async loginUser(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // from authentication strategy: UserAuthStrategy
    const user = request.user as User;

    const [cookieOptions, accessToken] = (await this._service.loginUser(
      user,
      'User',
    )) as [CookieOptions, string];

    // set payload for cookie
    response.cookie(constants.cookieName, accessToken, cookieOptions);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      ...DtoMapper.toUserDto(user),
    };
  }
}
