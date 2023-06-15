import { Controller, Get, Param } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { ApiTags } from '@nestjs/swagger';
import {
  RankingRaces,
  RankingRacesDetail,
} from './entities/races/ranking.races.entity';
import { BaseResponse } from '@/base/base.response.api';
import {
  RankingDriver,
  RankingDriverDetail,
} from './entities/drivers/ranking.drivers.entity';
import {
  RankingTeam,
  RankingTeamDetail,
} from './entities/teams/ranking.races.entity';

@ApiTags('ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('/:season/races')
  rankingSeasonRace(
    @Param('season') season: string,
  ): Promise<BaseResponse<RankingRaces[]>> {
    return this.rankingService.getRaceRanking(season);
  }
  @Get('/:season/races/:grandPrix')
  rankingSeasonRaceDetail(
    @Param('season') season: string,
    @Param('grandPrix') grandPrix: string,
  ): Promise<BaseResponse<RankingRacesDetail>> {
    return this.rankingService.getRaceRankingDetail(season, grandPrix);
  }

  @Get('/:season/driver')
  rankingSeasonDriver(
    @Param('season') season: string,
  ): Promise<BaseResponse<RankingDriver[]>> {
    return this.rankingService.getDriverRanking(season);
  }

  @Get('/:season/driver/:driverName')
  rankingSeasonDriverDetail(
    @Param('season') season: string,
    @Param('driverName') driverName: string,
  ): Promise<BaseResponse<RankingDriverDetail[]>> {
    return this.rankingService.getDriverRankingDetail(season, driverName);
  }

  @Get('/:season/team')
  rankingSeasonTeam(
    @Param('season') season: string,
  ): Promise<BaseResponse<RankingTeam[]>> {
    return this.rankingService.getTeamRanking(season);
  }

  @Get('/:season/team/:teamName')
  rankingSeasonTeamDetail(
    @Param('season') season: string,
    @Param('teamName') teamName: string,
  ): Promise<BaseResponse<RankingTeamDetail[]>> {
    return this.rankingService.getTeamRankingDetail(season, teamName);
  }
}
