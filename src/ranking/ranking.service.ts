import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}
  async getRaceRanking(season: string) {
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
    return result.map((item) => {
      return {
        position: item.position,
        points: item.points,
        laps: item.laps,
        time: item.time,
        date: item.race.date,
        circuit: item.race.circuit,
        driver: item.driver.name,
        team: item.driver.driverTeamSeason[0]?.team.name,
      };
    });
  }
  async getRaceRankingDetail(season: string, grandPrix: string) {
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
      ...race,
      rank,
    };
  }
  async getDriverRanking(season: string) {
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
    return result.map((item, index) => {
      return {
        position: index + 1,
        name: item.name,
        nationality: item.nationality,
        team: item.driverTeamSeason[0]?.team.name,
        points: sumPoints.find((point) => point.driverName === item.name)?._sum
          .points,
      };
    });
  }
  async getDriverRankingDetail(season: string, driverName: string) {
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

    return result.map((item) => {
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
  }
  async getTeamRanking(season: string) {
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
      const driver = drivers.find((driver) => driver.name === item.driver.name);
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

    return teamRanking.sort((a, b) => b.points - a.points);
  }
  async getTeamRankingDetail(season: string, teamName: string) {
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
        return driver;
      }),
    );
    const flattenDrivers = driversDetail.flat();
    return flattenDrivers.reduce((acc, item) => {
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
  }
}
