import User from '../user/user.entity';
import BaseEntity from '../lib/base/base.entity';
import { Entity, Column, Index, ManyToOne } from 'typeorm';

@Entity('flights')
export default class Flight extends BaseEntity {
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
  public flightId: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  public departureDate: Date;

  @ManyToOne(() => User, (user) => user.flights)
  user: User;
}
