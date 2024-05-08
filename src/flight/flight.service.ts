import { Injectable } from '@nestjs/common';
import { FlightRepository } from './flight.repository';
import { IPagination, PagedItemDto } from '../lib/types';
import { FlightDto } from './dto/flight.dto';
import { CreateFlightDto } from './dto/createFlight.dto';

@Injectable()
export class FlightService {
  constructor(private repo: FlightRepository) {}

  public async getManyFlights(pageParams: IPagination): Promise<PagedItemDto> {
    return (await this.repo.getPagedFlights(pageParams)) as PagedItemDto;
  }

  public async getUserFlights(userId: number): Promise<FlightDto[]> {
    const userFlights = (await this.repo.getUserFlights(userId)) as FlightDto[];

    return userFlights;
  }

  public async getSingleUserFlight(
    userId: number,
    flightId: string,
  ): Promise<FlightDto> {
    const flight = (await this.repo.getSingleFlightForUser(
      userId,
      flightId,
    )) as FlightDto;

    return flight;
  }

  public async getSingleFlight(flightId: string): Promise<FlightDto> {
    const flight = (await this.repo.getSingleFlight(flightId)) as FlightDto;

    return flight;
  }

  public async createFlightBooking(flight: CreateFlightDto) {
    const newFlight = (await this.repo.createFlight(flight)) as FlightDto;

    return newFlight;
  }

  public async deleteFlight(userId: number, flightId: string) {
    const isDeleted = await this.repo.deleteFlightBooking(userId, flightId);

    return isDeleted ? true : false;
  }
}
