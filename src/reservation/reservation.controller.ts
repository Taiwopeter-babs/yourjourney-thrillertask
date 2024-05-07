import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ReservationService } from './reservation.service';
import {
  CreateReservationDto,
  DeleteReservationDto,
} from './dto/createReservation.dto';
import { GetUserReservationDto } from './dto/reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly resService: ReservationService) {}

  @MessagePattern({ cmd: 'makeReservation' })
  public async bookFlight(@Payload() resDto: CreateReservationDto) {
    const newReservation = await this.resService.createReservation(resDto);

    return newReservation;
  }

  @MessagePattern({ cmd: 'getUserReservation' })
  public async getUserReservation(@Payload() resDto: GetUserReservationDto) {
    const { userId, reservationId } = resDto;
    const userReservation = await this.resService.getSingleUserReservation(
      userId,
      reservationId,
    );

    return userReservation;
  }

  @MessagePattern({ cmd: 'cancelReservation' })
  public async cancelReservation(@Payload() resDto: DeleteReservationDto) {
    const { userId, reservationId } = resDto;
    await this.resService.deleteReservation(userId, reservationId);

    return { statusCode: 204, message: 'Reservation is cancelled' };
  }
}
