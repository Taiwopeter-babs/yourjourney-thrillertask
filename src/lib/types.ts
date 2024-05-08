import { FlightDto } from 'src/flight/dto/flight.dto';
import { ReservationDto } from 'src/reservation/dto/reservation.dto';
import UserDto from 'src/user/dto/user.dto';

export interface ICorsConfig {
  methods: string | string;
  origin: string | string[];
}

export interface IPagination {
  pageNumber: number;
  pageSize: number;
}

export type TEntity = 'User';

export interface ITokenPayload {
  email: string;
  entityType: TEntity;
  sub: number;
}

export type PagedItemDto = {
  // entities: UserDto[] | FlightDto[] | ReservationDto[];
  hasPrevious: boolean;
  hasNext: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

export type PagedUserDto = {
  users: UserDto[];
} & PagedItemDto;

export type PagedFlightDto = {
  flights: FlightDto[];
} & PagedItemDto;

export type PagedReservationDto = {
  reservations: ReservationDto[];
} & PagedItemDto;
