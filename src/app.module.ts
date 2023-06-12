import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SeasonsModule } from './seasons/seasons.module';

@Module({
  imports: [PrismaModule, SeasonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
