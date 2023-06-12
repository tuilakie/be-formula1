import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SeasonsController],
  providers: [SeasonsService, PrismaService],
  exports: [SeasonsService],
})
export class SeasonsModule {}
