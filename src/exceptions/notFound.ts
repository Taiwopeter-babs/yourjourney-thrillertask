import { HttpException, HttpStatus } from '@nestjs/common';

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

export class FlightNotFoundException extends NotFoundException {
  constructor(flightId: number | string) {
    super(`Flight booking with the id: ${flightId}, was not found`);
  }
}

export class ReservationNotFoundException extends NotFoundException {
  constructor(reservationId: number | string) {
    super(`Reservation with the id: ${reservationId}, was not found`);
  }
}
