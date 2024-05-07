export class ReservationDto {
  public id: number;

  public reservationId: string;

  public userId: number;

  public userEmail: string;

  public createdAt: Date;

  public updatedAt: Date;
}

export class GetUserReservationDto {
  public readonly userId: number;

  public readonly reservationId: string;
}
