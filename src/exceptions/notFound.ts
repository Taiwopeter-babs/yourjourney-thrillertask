import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(userId: number | string) {
    super(`User with the id: ${userId}, was not found`);
  }
}

export class FlightNotFoundException extends RpcException {
  constructor(flightId: number | string) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      message: `Flight booking with the id: ${flightId}, was not found`,
    });
  }
}

export class ReservationNotFoundException extends RpcException {
  constructor(reservationId: number | string) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      message: `Reservation with the id: ${reservationId}, was not found`,
    });
  }
}
