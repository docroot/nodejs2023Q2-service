import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
//import { User } from './user/entities/user.entity';

dotenv.config();

const pg_host = process.env['POSTGRES_HOST'] ?? 'localhost';
const pg_port = Number(process.env['POSTGRES_PORT']) ?? 5432;
const pg_user = process.env['POSTGRES_USER'] ?? 'nodejs';
const pg_pass = process.env['POSTGRES_PASSWORD'] ?? 'password';
const pg_db = process.env['POSTGRES_DB'] ?? 'nodejs';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: pg_host,
  port: pg_port,
  username: pg_user,
  password: pg_pass,
  database: pg_db,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //entities: [User],
  synchronize: true, // Only for development, set to false in production
};

export default typeOrmConfig;
