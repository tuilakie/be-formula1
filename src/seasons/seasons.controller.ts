import { Controller, Get, Query, Param } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('seasons')
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.seasonsService.findAll({ skip, take });
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.seasonsService.findOne(name);
  }
}
