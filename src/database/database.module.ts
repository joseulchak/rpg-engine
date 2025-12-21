import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from 'src/config/db.config';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
