import { FindManyOptions, Repository } from 'typeorm';

import Reservation from './reservation.entity';
import { CreateReservationDto } from './dto/createReservation.dto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReservationDto } from './dto/reservation.dto';

import errorHandler from '../exceptions/errorHandler';
import { ReservationNotFoundException } from '../exceptions/notFound';

import { IPagination, PagedItemDto } from 'src/lib/types';
import getPaginationOffset from '../lib/pagination';

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectRepository(Reservation)
    private repo: Repository<Reservation>,
  ) {}

  public async getSingleReservationForUser(
    userId: number,
    reservationId: string,
  ): Promise<Reservation | void> {
    return (await this.getSingleUserReservation(
      userId,
      reservationId,
    )) as Reservation;
  }

  public async getSingleReservation(
    reservationId: string,
  ): Promise<Reservation> {
    return (await this.getReservation(reservationId)) as Reservation;
  }

  public async getPagedReservations(
    pageParams: IPagination,
  ): Promise<PagedItemDto | void> {
    try {
      const pageOffset = getPaginationOffset(pageParams);

      const paginationOptions: FindManyOptions<Reservation> = {
        skip: pageOffset,
        take: pageParams.pageSize,
        order: { id: 'ASC' },
      };

      const [itemsCount, reservations] = await Promise.all([
        // items count
        await this.repo.count(),
        // data
        await this.repo.find({ ...paginationOptions }),
      ]);

      const totalPages = Math.ceil(itemsCount / pageParams.pageSize);

      const data: PagedItemDto = {
        entities: reservations.map((res) => res as ReservationDto),
        currentPage: pageParams.pageNumber,
        pageSize: pageParams.pageSize,
        totalPages: totalPages,
        totalItems: itemsCount,
        hasNext: pageParams.pageNumber < totalPages,
        hasPrevious: pageParams.pageNumber > 1,
      };

      return data;
    } catch (error) {
      errorHandler(error);
    }
  }

  public async getUserReservations(
    userId: number,
  ): Promise<ReservationDto[] | void> {
    try {
      const reservations = await this.repo.find({
        where: { userId: userId },
      });

      return reservations.map((res) => res as ReservationDto);
    } catch (error) {
      errorHandler(error);
    }
  }

  public async createReservation(reservation: CreateReservationDto) {
    try {
      reservation.reservationId = await this.generateReservationId(
        reservation.userEmail,
      );

      const newReservation = await this.repo.save(
        reservation as unknown as Reservation,
      );

      return newReservation as ReservationDto;
    } catch (error) {
      console.error(error);
      errorHandler(error);
    }
  }

  public async deleteReservation(userId: number, reservationId: string) {
    (await this.getSingleReservationForUser(
      userId,
      reservationId,
    )) as Reservation;

    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .from(Reservation)
        .where('userId = :userId', { userId: userId })
        .andWhere('reservationId = :reservationId', {
          reservationId: reservationId,
        })
        .execute();

      return true;
    } catch (error) {
      errorHandler(error);
    }
  }

  private async getReservation(
    reservationId: string,
  ): Promise<Reservation | void> {
    try {
      const reservation = await this.repo.findOne({
        where: { reservationId: reservationId },
      });

      if (!reservation) {
        throw new ReservationNotFoundException(reservationId);
      }

      return reservation;
    } catch (error) {
      errorHandler(error);
    }
  }

  private async getSingleUserReservation(
    userId: number,
    reservationId: string,
  ): Promise<Reservation | void> {
    try {
      const reservation = await this.repo.findOne({
        where: { reservationId: reservationId, userId: userId },
      });

      if (!reservation) {
        throw new ReservationNotFoundException(reservationId);
      }

      return reservation;
    } catch (error) {
      errorHandler(error);
    }
  }

  // Generate flightId
  public generateReservationId(email: string): Promise<string> {
    return new Promise((resolve) => {
      let result = '';

      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charsLength = chars.length;

      let count = 0;

      while (count < 12) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
        count += 1;
      }
      resolve(`${email}_${result}`);
    });
  }
}
