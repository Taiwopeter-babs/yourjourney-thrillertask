import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightRepository } from './flight.repository';
import Flight from './flight.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightController } from './flight.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Flight])],
  providers: [FlightService, FlightRepository],
  controllers: [FlightController],
})
export class FlightModule {}
