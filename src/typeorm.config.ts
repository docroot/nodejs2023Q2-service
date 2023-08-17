import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
//import { User } from './user/entities/user.entity';

dotenv.config();

const pg_host = process.env['DB_HOST'] ?? 'localhost';
const pg_port = Number(process.env['DB_PORT']) ?? 5432;
const pg_user = process.env['DB_USER'] ?? 'nodejs';
const pg_pass = process.env['DB_PASSWORD'] ?? 'password';
const pg_db = process.env['DB_NAME'] ?? 'nodejs';

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
