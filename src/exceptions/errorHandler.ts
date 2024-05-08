import { ServerErrorException } from './serverError';

// import { BadRequestException } from '@nestjs/common';

/**
 * Every error is a class that is derived from HttpException
 * @param error The error
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

  console.log(error);

  console.log(name);

  const isAvailable = exceptionsList.find((exceptions) =>
    exceptions.includes(name),
  );

  if (!isAvailable) {
    throw new ServerErrorException(message);
  }

  console.log('Appropriate error');

  // throw error;
  throw error;
}
