import { Injectable } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { IPagination, PagedItemDto } from '../lib/types';
import { ReservationDto } from './dto/reservation.dto';
import { CreateReservationDto } from './dto/createReservation.dto';

@Injectable()
export class ReservationService {
  constructor(private repo: ReservationRepository) {}

  public async getManyReservations(
    pageParams: IPagination,
  ): Promise<PagedItemDto> {
    return (await this.repo.getPagedReservations(pageParams)) as PagedItemDto;
  }

  public async getUserReservations(userId: number): Promise<ReservationDto[]> {
    const userFlights = (await this.repo.getUserReservations(
      userId,
    )) as ReservationDto[];

    return userFlights;
  }

  public async getSingleUserReservation(
    userId: number,
    reservationId: string,
  ): Promise<ReservationDto> {
    const reservation = (await this.repo.getSingleReservationForUser(
      userId,
      reservationId,
    )) as ReservationDto;

    return reservation;
  }

  public async getSingleReservation(
    reservationId: string,
  ): Promise<ReservationDto> {
    const flight = (await this.repo.getSingleReservation(
      reservationId,
    )) as ReservationDto;

    return flight;
  }

  public async createReservation(reservation: CreateReservationDto) {
    const newReservation = (await this.repo.createReservation(
      reservation,
    )) as ReservationDto;

    return newReservation;
  }

  public async deleteReservation(userId: number, reservationId: string) {
    const isDeleted = await this.repo.deleteReservation(userId, reservationId);

    return isDeleted ? true : false;
  }
}
