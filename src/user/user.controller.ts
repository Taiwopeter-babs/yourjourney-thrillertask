import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { IPagination } from '../lib/types';
import { UserService } from './user.service';

import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UpdateUserDto, UserRoleDto } from './dto/createUser.dto';
import RoleGuard from 'src/auth/guards/role.guard';
import { Role } from './user.entity';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateFlightDto,
  DeleteFlightDto,
} from 'src/flight/dto/createFlight.dto';
import { GetUserFlightDto } from 'src/flight/dto/flight.dto';
import {
  CreateReservationDto,
  DeleteReservationDto,
} from 'src/reservation/dto/createReservation.dto';
import { GetUserReservationDto } from 'src/reservation/dto/reservation.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('FLIGHT_SERVICE') private flightService: ClientProxy,
    @Inject('RESERVATION_SERVICE') private resService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUsers(@Req() request: Request) {
    const { pageNumber, pageSize } = request.query as Record<string, any>;

    const pageParams = {
      pageNumber: parseInt(pageNumber, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 20,
    } as IPagination;

    const internsData = await this.userService.getManyUsers(pageParams);

    return { statusCode: 200, ...internsData };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);

    return { statusCode: 200, ...user };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser(id, updateUserDto);

    return {};
  }

  /** Only an admin can update a user role */
  @Put(':id/roles')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() userRoleDto: UserRoleDto,
  ) {
    await this.userService.updateUserRoles(id, userRoleDto);

    return {};
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
    return {};
  }

  // ==== FLIGHTS =====================

  @Post(':id/flights')
  @UseGuards(JwtAuthGuard)
  public async bookFlight(
    @Param('id', ParseIntPipe) id: number,
    @Body() flightDto: CreateFlightDto,
  ) {
    // check user
    await this.userService.getUser(id);

    return this.flightService.send({ cmd: 'bookFlight' }, flightDto);
  }

  /** Admin restricted method */
  @Get('flights/:flightId')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  public async getSingleFlight(@Param('flightId') flightId: string) {
    // const data: GetUserFlightDto = { userId: id, flightId: flightId };

    return this.flightService.send({ cmd: 'getSingleFlight' }, flightId);
  }

  @Get(':id/flights/:flightId')
  @UseGuards(JwtAuthGuard)
  public async getSingleUserFlight(
    @Param('id', ParseIntPipe) id: number,
    @Param('flightId') flightId: string,
  ) {
    const data: GetUserFlightDto = { userId: id, flightId: flightId };

    return this.flightService.send({ cmd: 'getUserFlight' }, data);
  }

  @Delete(':id/flights/:flightId')
  @UseGuards(JwtAuthGuard)
  public async cancelFlight(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const { flightId } = request.params;

    const data: DeleteFlightDto = { userId: id, flightId: flightId };

    return this.flightService.send({ cmd: 'cancelFlight' }, data);
  }

  // ==== RESERVATIONS ================
  @Post(':id/reservations')
  @UseGuards(JwtAuthGuard)
  public async makeReservation(@Body() resDto: CreateReservationDto) {
    return this.resService.send({ cmd: 'makeReservation' }, resDto);
  }

  /** Admin restricted method */
  @Get('reservations/:reservationId')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  public async getSingleReservation(
    @Param('reservationId') reservationId: string,
  ) {
    return this.resService.send({ cmd: 'getSingleReservation' }, reservationId);
  }

  @Get(':id/reservations/:reservationId')
  @UseGuards(JwtAuthGuard)
  public async getSingleUserReservation(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const { reservationId } = request.params;

    const data: GetUserReservationDto = {
      userId: id,
      reservationId: reservationId,
    };

    return this.resService.send({ cmd: 'getUserReservation' }, data);
  }

  @Delete(':id/reservations/:reservationId')
  @UseGuards(JwtAuthGuard)
  public async cancelReservation(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const { reservationId } = request.params;

    const data: DeleteReservationDto = {
      userId: id,
      reservationId: reservationId,
    };

    return this.flightService.send({ cmd: 'cancelFlight' }, data);
  }
}
