import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { Gender, Role } from '../user.entity';

class BaseUserDto {
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: string;

  @IsNotEmpty()
  public phone: string;
}

/** Dto for user creation */
export class CreateUserDto extends BaseUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;

  @IsOptional()
  @IsEnum(Role)
  public roles?: Role[];
}

/** Dto for user login */
export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;
}

/** Dto for user update. All properties are optional */
export class UpdateUserDto extends PartialType(BaseUserDto) {}

/** Dto for user roles */
export class UserRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  public role: Role[];
}
