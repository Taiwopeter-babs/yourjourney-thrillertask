import BaseEntity from '../lib/base/base.entity';
import { Entity, Column, Index } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Entity('users')
export default class User extends BaseEntity {
  @Index()
  @Column({
    type: 'varchar',
    length: 60,
    unique: true,
    nullable: false,
  })
  public email: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  public password: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public firstName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  public gender: Gender;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  public phone: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  public roles: Role[];
}
