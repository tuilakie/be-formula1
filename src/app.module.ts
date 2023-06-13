import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SeasonsModule } from './seasons/seasons.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [PrismaModule, SeasonsModule, RankingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
