import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}
  async getRaceRanking(season: string): Promise<BaseResponse<RankingRaces[]>> {
    const result = await this.prisma.ranking.findMany({
      where: {
        seasonName: season,
        position: {
          equals: '1',
        },
      },
      select: {
        position: true,
        points: true,
        laps: true,
        time: true,
        grandPrix: true,
        race: {
          select: {
            date: true,
            circuit: true,
          },
        },
        driver: {
          select: {
            name: true,
            driverTeamSeason: {
              select: {
                team: {
                  select: {
                    name: true,
                  },
                },
              },
              where: {
                seasonName: season,
              },
            },
          },
        },
      },
      orderBy: {
        race: {
          date: 'asc',
        },
      },
    });
    const data = result.map((item) => {
      return {
        position: item.position,
        grandPrix: item.grandPrix,
        points: item.points,
        laps: item.laps,
        time: item.time,
        date: item.race.date,
        circuit: item.race.circuit,
        driver: item.driver.name,
        team: item.driver.driverTeamSeason[0]?.team.name,
      };
    });
    return {
      success: true,
      message: 'Ranking retrieved successfully',
      data,
    };
  }
  async getRaceRankingDetail(
    season: string,
    grandPrix: string,
  ): Promise<BaseResponse<RankingRacesDetail>> {
    const result = await this.prisma.ranking.findMany({
      where: {
        seasonName: season,
        grandPrix: {
          equals: grandPrix,
          mode: 'insensitive',
        },
      },
      select: {
        position: true,
        points: true,
        laps: true,
        time: true,
        driver: {
          select: {
            name: true,
            driverTeamSeason: {
              select: {
                team: {
                  select: {
                    name: true,
                  },
                },
              },
              where: {
                seasonName: season,
              },
            },
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    const rank = result.map((item) => {
      return {
        position: item.position,
        points: item.points,
        laps: item.laps,
        time: item.time,
        driver: item.driver.name,
        team: item.driver.driverTeamSeason[0]?.team.name,
      };
    });

    const race = await this.prisma.race.findUnique({
      where: {
        seasonName_grandPrix: {
          seasonName: season,
          grandPrix: grandPrix.toUpperCase(),
        },
      },
      select: {
        grandPrix: true,
        date: true,
        circuit: true,
        title: true,
      },
    });
    return {
      success: true,
      message: 'Ranking retrieved successfully',
      data: {
        ...race,
        rank,
      },
    };
  }
  async getDriverRanking(
    season: string,
  ): Promise<BaseResponse<RankingDriver[]>> {
    const sumPoints = await this.prisma.ranking.groupBy({
      by: ['driverName'],
      where: {
        seasonName: season,
      },
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: 'desc',
        },
      },
    });
    const result = await this.prisma.driver.findMany({
      where: {
        name: {
          in: sumPoints.map((item) => item.driverName),
        },
      },
      select: {
        name: true,
        nationality: true,
        driverTeamSeason: {
          select: {
            team: {
              select: {
                name: true,
              },
            },
          },
          where: {
            seasonName: season,
          },
        },
      },
    });
    const data = result.map((item, index) => {
      return {
        position: index + 1,
        name: item.name,
        nationality: item.nationality,
        team: item.driverTeamSeason[0]?.team.name,
        points: sumPoints.find((point) => point.driverName === item.name)?._sum
          .points,
      };
    });

    return {
      success: true,
      message: 'Ranking retrieved successfully',
      data,
    };
  }
  async getDriverRankingDetail(
    season: string,
    driverName: string,
  ): Promise<BaseResponse<RankingDriverDetail[]>> {
    const result = await this.prisma.ranking.findMany({
      where: {
        seasonName: season,
        driverName: driverName,
      },
      orderBy: {
        race: {
          date: 'asc',
        },
      },
      include: {
        driver: {
          select: {
            driverTeamSeason: {
              select: {
                team: {
                  select: {
                    name: true,
                  },
                },
              },
              where: {
                seasonName: season,
              },
            },
          },
        },
        race: {
          select: {
            date: true,
            circuit: true,
          },
        },
      },
    });

    const data = result.map((item) => {
      return {
        grandPrix: item.grandPrix,
        date: item.race.date,
        team: item.driver.driverTeamSeason[0]?.team.name,
        position: item.position,
        points: item.points,
        laps: item.laps,
        time: item.time,
      };
    });
    return {
      success: true,
      message: 'Ranking retrieved successfully',
      data,
    };
  }
  async getTeamRanking(season: string): Promise<BaseResponse<RankingTeam[]>> {
    const drivers = await this.getDriverRanking(season);
    const teams = await this.prisma.driverTeamSeason.findMany({
      where: {
        seasonName: season,
      },
      select: {
        team: {
          select: {
            name: true,
          },
        },
        driver: {
          select: {
            name: true,
          },
        },
      },
    });
    const teamRanking = teams.reduce((acc, item) => {
      const driver = drivers.data.find(
        (driver) => driver.name === item.driver.name,
      );
      if (driver) {
        const team = acc.find((team) => team.name === item.team.name);
        if (team) {
          team.points += driver.points;
        } else {
          acc.push({
            name: item.team.name,
            points: driver.points,
          });
        }
      }
      return acc;
    }, []);

    return {
      success: true,
      message: 'Ranking retrieved successfully',
      data: teamRanking.sort((a, b) => b.points - a.points),
    };
  }
  async getTeamRankingDetail(
    season: string,
    teamName: string,
  ): Promise<BaseResponse<RankingTeamDetail[]>> {
    const teams = await this.prisma.driverTeamSeason.findMany({
      where: {
        seasonName: season,
        teamName: teamName,
      },
    });

    const driversDetail = await Promise.all(
      teams.map(async (team) => {
        const driver = await this.getDriverRankingDetail(
          season,
          team.driverName,
        );
        return driver.data;
      }),
    );
    const flattenDrivers = driversDetail.flat();
    const data = flattenDrivers.reduce((acc, item) => {
      const index = acc.findIndex(
        (driver) => driver?.grandPrix === item.grandPrix,
      );
      if (index !== -1) {
        acc[index].points += item.points;
        return acc;
      } else {
        const newItem = {
          grandPrix: item.grandPrix,
          date: item.date,
          team: item.team,
          points: item.points,
        };
        return [...acc, newItem];
      }
    }, []);
    return {
      success: true,
      message: 'Ranking retrieved successfully',
      data,
    };
  }
}
