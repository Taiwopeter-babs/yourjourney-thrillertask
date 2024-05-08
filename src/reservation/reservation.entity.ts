import User from '../user/user.entity';
import BaseEntity from '../lib/base/base.entity';
import { Entity, Column, Index, ManyToOne } from 'typeorm';

@Entity('reservations')
export default class Reservation extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  public userEmail: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  public userId: number;

  @Index()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  public reservationId: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  public departureDate: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;
}
