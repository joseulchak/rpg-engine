import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';

export default (): TypeOrmModuleOptions => ({
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER),
  password: String(process.env.DB_PASS),
  database: String(process.env.DB_NAME),
  type: 'postgres',
  //   entities: [path.resolve(__dirname, '..' + '/**/*.entity{.js, .ts}')],
  autoLoadEntities: true,
  synchronize: true,
});
