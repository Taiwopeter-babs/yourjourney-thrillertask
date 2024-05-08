import Flight from 'src/flight/flight.entity';
import { Role } from '../user.entity';
import Reservation from 'src/reservation/reservation.entity';

export default class UserDto {
  public id: number;

  public email: string;

  public password?: string;

  public firstName: string;

  public lastName: string;

  public gender: string;

  public phone: string;

  public createdAt: Date;

  public updatedAt: Date;

  public roles?: Role[];

  public flights?: Flight[];

  public reservations?: Reservation[];
}
