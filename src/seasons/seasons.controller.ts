import { Controller, Get, Query, Param } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '@/base/base.response.api';
import { SeasonRaces } from './entities/season.races.entity';

@ApiTags('seasons')
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<BaseResponse<{ name: string }[]>> {
    return this.seasonsService.findAll({ skip, take });
  }

  @Get(':name')
  findOne(@Param('name') name: string): Promise<BaseResponse<SeasonRaces>> {
    return this.seasonsService.findOne(name);
  }
}
