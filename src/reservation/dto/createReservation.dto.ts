import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

class BaseReservationDto {
  @IsNotEmpty()
  @IsString()
  public userEmail: string;

  @IsNotEmpty()
  @IsInt()
  public userId: string;

  @IsOptional()
  @IsString()
  public reservationId: string;

  @IsNotEmpty()
  @IsDateString()
  public departureDate: Date;
}

/** Dto for flight creation */
export class CreateReservationDto extends BaseReservationDto {}

/** Dto for flight cancellation */
export class DeleteReservationDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  reservationId: string;
}
