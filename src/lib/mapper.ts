import User from '../user/user.entity';
import UserDto from '../user/dto/user.dto';
import { FlightDto } from '../flight/dto/flight.dto';
import Flight from '../flight/flight.entity';

/**
 * Maps entity from and to the Dto
 */
export default class DtoMapper {
  public static toUserDto(entity: User, includeRelations = false): UserDto {
    const dtoObj = { ...entity } as UserDto;

    delete dtoObj.password;
    delete dtoObj.roles;

    if (!includeRelations) {
      delete dtoObj.flights;
      delete dtoObj.reservations;
    }

    return dtoObj;
  }

  public static toFlightDto(entity: Flight): FlightDto {
    const dtoObj = { ...entity } as FlightDto;

    return dtoObj;
  }
}
