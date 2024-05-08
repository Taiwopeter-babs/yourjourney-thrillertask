import { ServerErrorException } from './serverError';

// import { BadRequestException } from '@nestjs/common';

/**
 * Every error is a class that is derived from HttpException
 * @param errorName The name of the exception
 * @param value The value to pass into the error constructor
 */
export default function errorHandler(error: Error) {
  const exceptionsList = [
    'UserNotFoundException',
    'ServerErrorException',
    'UserAlreadyExistsException',
    'WrongCredentialsException',
    'FlightNotFoundException',
    'ReservationNotFoundException',
  ];

  const { name, message } = error;

  if (exceptionsList.indexOf(name) === -1) {
    throw new ServerErrorException(message);
  }

  throw error;
}
