import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UserAlreadyExistsException extends BadRequestException {
  constructor(userId: number | string) {
    super(`User with the id: ${userId}, already exists`);
  }
}

export class WrongCredentialsException extends BadRequestException {
  constructor() {
    super('Wrong credentials provided');
  }
}
