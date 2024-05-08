import { Controller } from '@nestjs/common';
import { FlightService } from './flight.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFlightDto, DeleteFlightDto } from './dto/createFlight.dto';
import { GetUserFlightDto } from './dto/flight.dto';

@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @MessagePattern({ cmd: 'bookFlight' })
  public async bookFlight(@Payload() flightDto: CreateFlightDto) {
    const newFlightBooking =
      await this.flightService.createFlightBooking(flightDto);

    return newFlightBooking;
  }

  @MessagePattern({ cmd: 'getSingleFlight' })
  public async getSingleFlight(@Payload() flightId: string) {
    return await this.flightService.getSingleFlight(flightId);
  }

  @MessagePattern({ cmd: 'getUserFlight' })
  public async getUserFlight(@Payload() flightDto: GetUserFlightDto) {
    const { userId, flightId } = flightDto;
    const userFlight = await this.flightService.getSingleUserFlight(
      userId,
      flightId,
    );

    return userFlight;
  }

  @MessagePattern({ cmd: 'getUserFlights' })
  public async getUserFlights(@Payload() flightDto: GetUserFlightDto) {
    const { userId, flightId } = flightDto;
    const userFlight = await this.flightService.getSingleUserFlight(
      userId,
      flightId,
    );

    return userFlight;
  }

  @MessagePattern({ cmd: 'cancelFlight' })
  public async cancelFlight(@Payload() flightDto: DeleteFlightDto) {
    const { userId, flightId } = flightDto;
    await this.flightService.deleteFlight(userId, flightId);

    return { statusCode: 204, message: 'Flight is cancelled' };
  }
}
