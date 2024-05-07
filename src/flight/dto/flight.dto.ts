export class FlightDto {
  public id: number;

  public flightId: string;

  public userId: number;

  public userEmail: string;

  public createdAt: Date;

  public updatedAt: Date;
}

export class GetUserFlightDto {
  public readonly userId: number;

  public readonly flightId: string;
}
