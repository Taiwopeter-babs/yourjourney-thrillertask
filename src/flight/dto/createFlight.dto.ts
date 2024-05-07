import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

class BaseFlightDto {
  @IsNotEmpty()
  @IsString()
  public userEmail: string;

  @IsNotEmpty()
  @IsInt()
  public userId: string;

  @IsOptional()
  @IsString()
  public flightId: string;

  @IsNotEmpty()
  @IsDateString()
  public departureDate: Date;
}

/** Dto for flight creation */
export class CreateFlightDto extends BaseFlightDto {}

/** Dto for user update. All properties are optional */
export class UpdateFlightDto extends PartialType(BaseFlightDto) {}

/** Dto for flight cancellation */
export class DeleteFlightDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  flightId: string;
}
