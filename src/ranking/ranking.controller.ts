import { Controller, Get, Param } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('/:season/races')
  rankingSeasonRace(@Param('season') season: string) {
    return this.rankingService.getRaceRanking(season);
  }
  @Get('/:season/races/:grandPrix')
  rankingSeasonRaceDetail(
    @Param('season') season: string,
    @Param('grandPrix') grandPrix: string,
  ) {
    return this.rankingService.getRaceRankingDetail(season, grandPrix);
  }

  @Get('/:season/driver')
  rankingSeasonDriver(@Param('season') season: string) {
    return this.rankingService.getDriverRanking(season);
  }

  @Get('/:season/driver/:driverName')
  rankingSeasonDriverDetail(
    @Param('season') season: string,
    @Param('driverName') driverName: string,
  ) {
    return this.rankingService.getDriverRankingDetail(season, driverName);
  }

  @Get('/:season/team')
  rankingSeasonTeam(@Param('season') season: string) {
    return this.rankingService.getTeamRanking(season);
  }

  @Get('/:season/team/:teamName')
  rankingSeasonTeamDetail(
    @Param('season') season: string,
    @Param('teamName') teamName: string,
  ) {
    return this.rankingService.getTeamRankingDetail(season, teamName);
  }
}
