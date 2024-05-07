import { FindManyOptions, Repository } from 'typeorm';

import Flight from './flight.entity';
import { CreateFlightDto } from './dto/createFlight.dto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import DtoMapper from '../lib/mapper';
import { FlightDto } from './dto/flight.dto';

import errorHandler from '../exceptions/errorHandler';
import { FlightNotFoundException } from '../exceptions/notFound';

import { IPagination, PagedItemDto } from 'src/lib/types';
import getPaginationOffset from '../lib/pagination';

@Injectable()
export class FlightRepository {
  constructor(
    @InjectRepository(Flight)
    private repo: Repository<Flight>,
  ) {}

  public async getSingleFlightForUser(
    userId: number,
    flightId: string,
  ): Promise<Flight | void> {
    return (await this.getSingleUserFlight(userId, flightId)) as Flight;
  }

  public async getSingleFlight(flightId: string): Promise<Flight> {
    return (await this.getSingleFlight(flightId)) as Flight;
  }

  public async getPagedFlights(
    pageParams: IPagination,
  ): Promise<PagedItemDto | void> {
    try {
      const pageOffset = getPaginationOffset(pageParams);

      const paginationOptions: FindManyOptions<Flight> = {
        skip: pageOffset,
        take: pageParams.pageSize,
        order: { id: 'ASC' },
      };

      const [itemsCount, flights] = await Promise.all([
        // items count
        await this.repo.count(),
        // data
        await this.repo.find({ ...paginationOptions }),
      ]);

      const totalPages = Math.ceil(itemsCount / pageParams.pageSize);

      const data: PagedItemDto = {
        entities: flights.map((flight) => DtoMapper.toFlightDto(flight)),
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

  public async getUserFlights(userId: number): Promise<FlightDto[] | void> {
    try {
      const flights = await this.repo.find({
        where: { userId: userId },
      });

      return flights.map((flight) => DtoMapper.toFlightDto(flight));
    } catch (error) {
      errorHandler(error);
    }
  }

  public async createFlight(flight: CreateFlightDto) {
    try {
      flight.flightId = await this.generateFlightId(flight.userEmail);

      const newFlight = await this.repo.save(flight as unknown as Flight);

      return DtoMapper.toFlightDto(newFlight) as FlightDto;
    } catch (error) {
      console.error(error);
      errorHandler(error);
    }
  }

  public async deleteFlightBooking(userId: number, flightId: string) {
    (await this.getSingleUserFlight(userId, flightId)) as Flight;

    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .from(Flight)
        .where('userId = :userId', { userId: userId })
        .andWhere('flightId = :flightId', { flightId: flightId })
        .execute();

      return true;
    } catch (error) {
      errorHandler(error);
    }
  }

  private async getFlight(flightId: string): Promise<Flight | void> {
    try {
      const flight = await this.repo.findOne({
        where: { flightId: flightId },
      });

      if (!flight) {
        throw new FlightNotFoundException(flightId);
      }

      return flight;
    } catch (error) {
      errorHandler(error);
    }
  }

  private async getSingleUserFlight(
    userId: number,
    flightId: string,
  ): Promise<Flight | void> {
    try {
      const flight = await this.repo.findOne({
        where: { flightId: flightId, userId: userId },
      });

      if (!flight) {
        throw new FlightNotFoundException(flightId);
      }

      return flight;
    } catch (error) {
      errorHandler(error);
    }
  }

  // Generate flightId
  public generateFlightId(email: string): Promise<string> {
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
