import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => ({
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASS),
  database: String(process.env.DB_NAME),
  type: 'postgres',
  autoLoadEntities: true,
  synchronize: true,
});
