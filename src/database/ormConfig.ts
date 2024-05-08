// This file serves only as the path for typeorm migrations generation as it is the duplicate
// of the configuration found in database.module.ts file in this same folder path.
// TypeOrm requires an exported Datasource file. This is it

import { DataSource } from 'typeorm';
import configuration from '../configuration';
import User from '../user/user.entity';
import Flight from '../flight/flight.entity';
import Reservation from '../reservation/reservation.entity';

/**
 * This is for typeorm migrations generation.
 */
const dataSource: DataSource = new DataSource({
  // TypeORM PostgreSQL DB Drivers configuration
  ...configuration().POSTGRES,
  entities: [User, Flight, Reservation],
  // Synchronize database schema with entities
  synchronize: configuration().NODE_ENV === 'development',
  migrations: ['./migrations/*.ts'],
  migrationsTableName: 'yourjourney_migrations',
});

export default dataSource;
